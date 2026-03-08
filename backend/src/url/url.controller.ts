import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  Res,
  Inject,
} from '@nestjs/common';
import { CreateUrlDto } from './dto/url.dto';
import { IUrlService } from './interfaces/url-service.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ROUTES } from '../common/constants/routes';
import type { JwtRequest } from '../auth/interfaces/jwt-request.interface';
import type { Response } from 'express';

@Controller(ROUTES.URL.PREFIX)
export class UrlController {
  constructor(
    @Inject('IUrlService')
    private readonly _urlService: IUrlService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(ROUTES.URL.SHORTEN)
  async shorten(
    @Body() createUrlDto: CreateUrlDto,
    @Request() req: JwtRequest,
  ) {
    return this._urlService.createUrl(createUrlDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(ROUTES.URL.MY_URLS)
  async getMyUrls(@Request() req: JwtRequest) {
    return this._urlService.getMyUrls(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(ROUTES.URL.DELETE)
  async deleteUrl(@Param('id') id: string, @Request() req: JwtRequest) {
    return this._urlService.deleteUrl(id, req.user.userId);
  }
}

@Controller(ROUTES.REDIRECT.PREFIX)
export class RedirectController {
  constructor(
    @Inject('IUrlService')
    private readonly _urlService: IUrlService,
  ) {}

  @Get(ROUTES.REDIRECT.CODE)
  async redirect(@Param('code') code: string, @Res() res: Response) {
    const result = await this._urlService.resolveUrl(code);
    return res.redirect(result.data.originalUrl);
  }
}
