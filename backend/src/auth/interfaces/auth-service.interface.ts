import { RegisterDto, LoginDto } from '../dto/auth.dto';

export interface IAuthService {
  register(registerDto: RegisterDto): Promise<{ message: string; data: any }>;
  login(loginDto: LoginDto): Promise<{ message: string; data: any }>;
  verifyEmail(token: string): Promise<{ message: string }>;
  resendVerification(email: string): Promise<{ message: string }>;
  refreshToken(refreshToken: string): Promise<{ message: string; data: any }>;
}
