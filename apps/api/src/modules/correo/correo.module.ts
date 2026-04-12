import { Module } from '@nestjs/common';
import { CorreoService } from './correo.service';
import { PrismaModule } from '../../prisma/prisma.module';

/** Placeholder — implemented fully in Phase 4 */
@Module({
  imports: [PrismaModule],
  providers: [CorreoService],
  exports: [CorreoService],
})
export class CorreoModule {}
