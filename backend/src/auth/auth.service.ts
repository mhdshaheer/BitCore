import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import type { IUserRepository } from '../user/interfaces/user-repository.interface';
import { MESSAGES } from '../common/constants/messages';

import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _mailService: MailService,
  ) {}

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = await this._jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refreshToken = await this._jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async sendVerificationEmail(
    email: string,
    fullName: string,
    token: string,
  ) {
    const frontendUrl =
      this._configService.get<string>('FRONTEND_URL') ||
      'http://localhost:4200';
    const verificationUrl = `${frontendUrl}/auth/verify?token=${token}`;

    await this._mailService.sendMail(
      email,
      'Verify Your Email - BitCore',
      `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="background: #4f46e5; color: white; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; font-weight: bold; font-size: 24px; display: inline-block;">B</div>
            <h1 style="color: #0f172a; margin-top: 12px;">BitCore</h1>
          </div>
          <p style="color: #475569; font-size: 16px;">Hi ${fullName},</p>
          <p style="color: #475569; font-size: 16px;">Welcome to BitCore! Please verify your email address to start shortening and managing your links.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verificationUrl}" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">Verify Email Address</a>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 11px; text-align: center;">&copy; 2026 BitCore. All rights reserved.</p>
        </div>
      `,
    );
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this._userRepository.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new ConflictException(MESSAGES.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24); // 24h expiry

    const user = await this._userRepository.create({
      ...registerDto,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
      isVerified: false,
    });

    // Send actual email
    await this.sendVerificationEmail(
      user.email,
      user.fullName,
      verificationToken,
    );

    const userObj = user.toJSON();
    const { password: _password, ...result } = userObj;
    return {
      message:
        'Account created. Please check your email to verify your account.',
      data: result,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this._userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user._id.toString(),
      user.email,
    );

    // Hash refresh token before saving to DB
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this._userRepository.update(user._id.toString(), {
      refreshToken: hashedRefreshToken,
    });

    const userObj = user.toJSON();
    const { password: _pw, ...userWithoutPassword } = userObj;
    return {
      message: MESSAGES.LOGIN_SUCCESS,
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      },
    };
  }

  async verifyEmail(token: string) {
    const user = await this._userRepository.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestException(MESSAGES.VERIFICATION_FAILED);
    }

    if (
      user.verificationTokenExpires &&
      new Date() > user.verificationTokenExpires
    ) {
      throw new BadRequestException('Verification token has expired.');
    }

    await this._userRepository.update(user._id.toString(), {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    });

    return {
      message: MESSAGES.VERIFICATION_SUCCESS,
    };
  }

  async resendVerification(email: string) {
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      // Return success regardless to avoid user enumeration
      return {
        message:
          'If an account exists with this email, a new verification link has been sent.',
      };
    }

    if (user.isVerified) {
      return { message: 'Account is already verified. Please sign in.' };
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);

    await this._userRepository.update(user._id.toString(), {
      verificationToken,
      verificationTokenExpires,
    });

    await this.sendVerificationEmail(
      user.email,
      user.fullName,
      verificationToken,
    );

    return {
      message: 'Verification link resent. Please check your email.',
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this._jwtService.verifyAsync(refreshToken);
      const user = await this._userRepository.findById(payload.sub);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user._id.toString(), user.email);

      // Update refresh token in DB (Refresh token rotation)
      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
      await this._userRepository.update(user._id.toString(), {
        refreshToken: hashedRefreshToken,
      });

      return {
        message: 'Tokens refreshed successfully',
        data: tokens,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
