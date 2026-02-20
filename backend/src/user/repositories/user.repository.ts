import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { IUserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly _model: Model<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = new this._model(user);
    return await newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this._model.findOne({ email }).select('+password').exec();
  }

  async findById(id: string): Promise<User | null> {
    return await this._model.findById(id).exec();
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return await this._model.findByIdAndUpdate(id, data, { new: true }).exec() as User;
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return await this._model.findOne({ verificationToken: token }).exec();
  }
}
