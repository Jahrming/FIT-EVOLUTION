import { Module } from '@nestjs/common'
import { SessionTokenController } from './session-token.controller'
import { SessionTokenService } from './session-token.service'

@Module({
  controllers: [SessionTokenController],
  providers: [SessionTokenService],
  exports: [SessionTokenService],
})
export class SessionTokenModule {}
