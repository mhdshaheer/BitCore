import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { IAuthTokens } from './auth-tokens.interface';

/**
 * Contract for the authentication service.
 * Controllers depend on this abstraction, not on any concrete class.
 */
export interface IAuthService {
  register(registerDto: RegisterDto): Promise<{ message: string; data: Record<string, unknown> }>;
  login(loginDto: LoginDto): Promise<{ message: string; data: { user: Record<string, unknown>; accessToken: string; refreshToken: string } }>;
  verifyEmail(token: string): Promise<{ message: string }>;
  resendVerification(email: string): Promise<{ message: string }>;
  refreshToken(refreshToken: string): Promise<{ message: string; data: IAuthTokens }>;
}
