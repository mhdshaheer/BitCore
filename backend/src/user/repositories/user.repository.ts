import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly _model: Model<User>,
  ) {}

  async create(user: Partial<IUser>): Promise<IUser> {
    const newUser = new this._model(user);
    return (await newUser.save()) as IUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return (await this._model
      .findOne({ email })
      .select('+password')
      .exec()) as IUser | null;
  }

  async findById(id: string): Promise<IUser | null> {
    return (await this._model
      .findById(id)
      .select('+refreshToken')
      .exec()) as IUser | null;
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser> {
    return (await this._model
      .findByIdAndUpdate(id, data, { new: true })
      .exec()) as IUser;
  }

  async findByVerificationToken(token: string): Promise<IUser | null> {
    return (await this._model
      .findOne({ verificationToken: token })
      .exec()) as IUser | null;
  }
}
