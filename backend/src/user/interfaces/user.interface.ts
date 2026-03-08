import { Types } from 'mongoose';

/**
 * Domain entity interface for a User.
 * Repository and service interfaces depend on this abstraction,
 * not on the Mongoose Document class (infrastructure detail).
 */
export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  fullName: string;
  isVerified: boolean;
  verificationToken: string | null;
  verificationTokenExpires: Date | null;
  refreshToken: string | null;
  toJSON(): Record<string, unknown>;
}
