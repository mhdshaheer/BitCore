import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { HttpStatus } from '../common/enums/http-status.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this._authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.SUCCESS)
  async login(@Body() loginDto: LoginDto) {
    return this._authService.login(loginDto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.SUCCESS)
  async verify(@Body('token') token: string) {
    return this._authService.verifyEmail(token);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.SUCCESS)
  async resendVerification(@Body('email') email: string) {
    return this._authService.resendVerification(email);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.SUCCESS)
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this._authService.refreshToken(refreshToken);
  }
}
