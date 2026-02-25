import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUrlRepository } from './interfaces/url-repository.interface';
import { CreateUrlDto } from './dto/url.dto';
import { MESSAGES } from '../common/constants/messages';
import * as crypto from 'crypto';

import { Types } from 'mongoose';

@Injectable()
export class UrlService {
  constructor(
    @Inject('IUrlRepository')
    private readonly _urlRepository: IUrlRepository,
  ) {}

  async createUrl(createUrlDto: CreateUrlDto, userId: string) {
    const { originalUrl } = createUrlDto;

    const existingUrl = await this._urlRepository.findByOriginalUrlAndUserId(
      originalUrl,
      userId,
    );
    if (existingUrl) {
      return {
        message: MESSAGES.URL_CREATED,
        data: existingUrl,
      };
    }

    const shortCode = this.generateShortCode();

    let finalCode = shortCode;
    let attempts = 0;
    while (
      (await this._urlRepository.findByShortCode(finalCode)) &&
      attempts < 5
    ) {
      finalCode = this.generateShortCode();
      attempts++;
    }

    const url = await this._urlRepository.create({
      originalUrl,
      shortCode: finalCode,
      userId: new Types.ObjectId(userId),
    });

    return {
      message: MESSAGES.URL_CREATED,
      data: url,
    };
  }

  async getMyUrls(userId: string) {
    const urls = await this._urlRepository.findByUserId(userId);
    return {
      message: MESSAGES.FETCH_SUCCESS,
      data: urls,
    };
  }

  async resolveUrl(shortCode: string) {
    const url = await this._urlRepository.findByShortCode(shortCode);
    if (!url) {
      throw new NotFoundException(MESSAGES.URL_NOT_FOUND);
    }

    await this._urlRepository.incrementClicks(url._id.toString());
    return {
      message: MESSAGES.FETCH_SUCCESS,
      data: url,
    };
  }

  async deleteUrl(id: string, userId: string) {
    const urls = await this._urlRepository.findByUserId(userId);
    const target = urls.find((u) => u._id.toString() === id);
    if (!target) {
      throw new NotFoundException(MESSAGES.URL_NOT_FOUND);
    }

    await this._urlRepository.delete(id);
    return {
      message: MESSAGES.DELETE_SUCCESS,
    };
  }

  private generateShortCode(): string {
    return crypto.randomBytes(4).toString('hex').slice(0, 6);
  }
}
