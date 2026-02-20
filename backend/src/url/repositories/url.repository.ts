import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Url } from '../schemas/url.schema';
import { IUrlRepository } from '../interfaces/url-repository.interface';

@Injectable()
export class UrlRepository implements IUrlRepository {
  constructor(
    @InjectModel(Url.name)
    private readonly _model: Model<Url>,
  ) {}

  async create(url: Partial<Url>): Promise<Url> {
    const newUrl = new this._model({
      ...url,
      userId: new Types.ObjectId(String(url.userId)),
    });
    return await newUrl.save();
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    return await this._model.findOne({ shortCode }).exec();
  }

  async findByOriginalUrlAndUserId(originalUrl: string, userId: string): Promise<Url | null> {
    return await this._model.findOne({ originalUrl, userId: new Types.ObjectId(userId) }).exec();
  }

  async findByUserId(userId: string): Promise<Url[]> {
    return await this._model.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
  }

  async incrementClicks(id: string): Promise<void> {
    await this._model.findByIdAndUpdate(id, { $inc: { clicks: 1 } }).exec();
  }

  async delete(id: string): Promise<void> {
    await this._model.findByIdAndDelete(id).exec();
  }
}
