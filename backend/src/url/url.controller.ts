import { Controller, Post, Get, Body, UseGuards, Request, Param, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/url.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtRequest } from '../auth/interfaces/jwt-request.interface';
import type { Response } from 'express';

@Controller('url')
export class UrlController {
  constructor(private readonly _urlService: UrlService) {}

  @UseGuards(JwtAuthGuard)
  @Post('shorten')
  async shorten(@Body() createUrlDto: CreateUrlDto, @Request() req: JwtRequest) {
    return this._urlService.createUrl(createUrlDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-urls')
  async getMyUrls(@Request() req: JwtRequest) {
    return this._urlService.getMyUrls(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete/:id')
  async deleteUrl(@Param('id') id: string, @Request() req: JwtRequest) {
    return this._urlService.deleteUrl(id, req.user.userId);
  }
}

@Controller('')
export class RedirectController {
  constructor(private readonly _urlService: UrlService) {}

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response) {
    const result = await this._urlService.resolveUrl(code);
    return res.redirect(result.data.originalUrl);
  }
}
