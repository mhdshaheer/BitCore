import { Controller, Post, Body, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { IAuthService } from './interfaces/auth-service.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService')
    private readonly _authService: IAuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this._authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this._authService.login(loginDto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body('token') token: string) {
    return this._authService.verifyEmail(token);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body('email') email: string) {
    return this._authService.resendVerification(email);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this._authService.refreshToken(refreshToken);
  }
}
