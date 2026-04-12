import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from './prisma/prisma.module'
import { SedesModule } from './modules/sedes/sedes.module'
import { TerminosModule } from './modules/terminos/terminos.module'
import { AceptacionModule } from './modules/aceptacion/aceptacion.module'
import { SessionTokenModule } from './modules/session-token/session-token.module'
import { CorreoModule } from './modules/correo/correo.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting: 5 requests per minute for public endpoints
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 5 }]),

    // DB
    PrismaModule,

    // Feature modules
    SedesModule,
    TerminosModule,
    AceptacionModule,
    SessionTokenModule,
    CorreoModule,
    AuthModule,
  ],
})
export class AppModule {}
