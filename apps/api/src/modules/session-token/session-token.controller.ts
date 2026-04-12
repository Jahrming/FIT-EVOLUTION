import { Controller, Get } from '@nestjs/common'
import { SessionTokenService } from './session-token.service'
import { SkipThrottle } from '@nestjs/throttler'

@Controller('session-token')
export class SessionTokenController {
  constructor(private readonly service: SessionTokenService) {}

  @SkipThrottle()  // Token generation is safe to call freely
  @Get()
  generate() {
    return this.service.generate()
  }
}
