import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Url } from '../schemas/url.schema';
import { IUrlRepository } from '../interfaces/url-repository.interface';
import { IUrl } from '../interfaces/url.interface';

@Injectable()
export class UrlRepository implements IUrlRepository {
  constructor(
    @InjectModel(Url.name)
    private readonly _model: Model<Url>,
  ) {}

  async create(url: Partial<IUrl>): Promise<IUrl> {
    const newUrl = new this._model({
      ...url,
      userId: new Types.ObjectId(String(url.userId)),
    });
    return (await newUrl.save()) as IUrl;
  }

  async findByShortCode(shortCode: string): Promise<IUrl | null> {
    return (await this._model.findOne({ shortCode }).exec()) as IUrl | null;
  }

  async findByOriginalUrlAndUserId(
    originalUrl: string,
    userId: string,
  ): Promise<IUrl | null> {
    return (await this._model
      .findOne({ originalUrl, userId: new Types.ObjectId(userId) })
      .exec()) as IUrl | null;
  }

  async findByUserId(userId: string): Promise<IUrl[]> {
    return (await this._model
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec()) as IUrl[];
  }

  async incrementClicks(id: string): Promise<void> {
    await this._model.findByIdAndUpdate(id, { $inc: { clicks: 1 } }).exec();
  }

  async delete(id: string): Promise<void> {
    await this._model.findByIdAndDelete(id).exec();
  }
}
