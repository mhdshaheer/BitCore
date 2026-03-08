import { IUser } from './user.interface';

/**
 * Abstracts all persistence operations for the User domain.
 * High-level modules (services) depend on this interface,
 * not on any concrete database implementation.
 */
export interface IUserRepository {
  create(user: Partial<IUser>): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  update(id: string, data: Partial<IUser>): Promise<IUser>;
  findByVerificationToken(token: string): Promise<IUser | null>;
}
