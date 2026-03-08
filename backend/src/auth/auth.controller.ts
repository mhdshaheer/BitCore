import { Controller, Post, Body, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { IAuthService } from './interfaces/auth-service.interface';
import { ROUTES } from '../common/constants/routes';

@Controller(ROUTES.AUTH.PREFIX)
export class AuthController {
  constructor(
    @Inject('IAuthService')
    private readonly _authService: IAuthService,
  ) {}

  @Post(ROUTES.AUTH.REGISTER)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this._authService.register(registerDto);
  }

  @Post(ROUTES.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this._authService.login(loginDto);
  }

  @Post(ROUTES.AUTH.VERIFY)
  @HttpCode(HttpStatus.OK)
  async verify(@Body('token') token: string) {
    return this._authService.verifyEmail(token);
  }

  @Post(ROUTES.AUTH.RESEND_VERIFICATION)
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body('email') email: string) {
    return this._authService.resendVerification(email);
  }

  @Post(ROUTES.AUTH.REFRESH)
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this._authService.refreshToken(refreshToken);
  }
}
