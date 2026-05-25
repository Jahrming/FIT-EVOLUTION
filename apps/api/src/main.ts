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
  const allowedOrigins = corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  app.use(helmet())
  app.getHttpAdapter().getInstance().set('trust proxy', 1)

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`), false)
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  app.setGlobalPrefix('api/v1')

  await app.listen(port)
  console.log(`API running on http://localhost:${port}/api/v1`)
}

bootstrap()
