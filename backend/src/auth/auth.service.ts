import { Injectable, ConflictException, UnauthorizedException, Inject, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import type { IUserRepository } from '../user/interfaces/user-repository.interface';
import { MESSAGES } from '../common/constants/messages';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    private readonly _jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this._userRepository.findByEmail(registerDto.email);
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

    // In a real app, send email here. 
    // For this project, we'll return it or log it for now.
    console.log(`Verification link: http://localhost:4200/auth/verify?token=${verificationToken}`);

    const userObj = user.toJSON();
    const { password, ...result } = userObj;
    return {
      message: 'Account created. Please check your console for the verification link.',
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

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
    }

    const payload = { email: user.email, sub: user._id.toString() };
    const accessToken = this._jwtService.sign(payload);

    const userObj = user.toJSON();
    const { password, ...userWithoutPassword } = userObj;
    return {
      message: MESSAGES.LOGIN_SUCCESS,
      data: {
        user: userWithoutPassword,
        accessToken,
      },
    };
  }

  async verifyEmail(token: string) {
    const user = await this._userRepository.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestException(MESSAGES.VERIFICATION_FAILED);
    }

    if (user.verificationTokenExpires && new Date() > user.verificationTokenExpires) {
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
}
