import { Types } from 'mongoose';

/**
 * Domain entity interface for a URL.
 * Repository and service interfaces depend on this abstraction,
 * not on the Mongoose Document class (infrastructure detail).
 */
export interface IUrl {
  _id: Types.ObjectId;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  userId: Types.ObjectId;
}
