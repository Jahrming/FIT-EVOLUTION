import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  })

  const config = app.get(ConfigService)
  const corsOrigin = config.get<string>('CORS_ORIGIN') || 'http://localhost:3000'
  const port = config.get<number>('PORT') || 3001

  // Security headers
  app.use(helmet())

  // CORS — only allow frontend origin
  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // strip unknown fields
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  // Global API prefix
  app.setGlobalPrefix('api/v1')

  await app.listen(port)
  console.log(`🚀 API running on http://localhost:${port}/api/v1`)
}

bootstrap()
