import { Module } from '@nestjs/common'
import { AceptacionController } from './aceptacion.controller'
import { AceptacionService } from './aceptacion.service'
import { SessionTokenModule } from '../session-token/session-token.module'
import { CorreoModule } from '../correo/correo.module'

@Module({
  imports: [SessionTokenModule, CorreoModule],
  controllers: [AceptacionController],
  providers: [AceptacionService],
})
export class AceptacionModule {}
