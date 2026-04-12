import { Controller, Post, Body, Req, HttpCode, HttpStatus, ConflictException } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { AceptacionService } from './aceptacion.service'
import { CreateAceptacionDto } from './dto/create-aceptacion.dto'
import type { Request } from 'express'

@Controller('aceptaciones')
export class AceptacionController {
  constructor(private readonly aceptacionService: AceptacionService) {}

  /** POST /api/v1/aceptaciones — Public; rate limited */
  @Post()
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAceptacionDto, @Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.ip ?? ''
    const userAgent = req.headers['user-agent'] ?? ''
    return this.aceptacionService.create(dto, ip, userAgent)
  }
}
