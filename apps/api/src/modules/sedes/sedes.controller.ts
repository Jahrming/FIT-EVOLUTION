import { Controller, Get, Param, NotFoundException } from '@nestjs/common'
import { SedesService } from './sedes.service'

@Controller('sedes')
export class SedesController {
  constructor(private readonly sedesService: SedesService) {}

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const sede = await this.sedesService.findBySlug(slug)
    if (!sede) throw new NotFoundException(`Sede "${slug}" no encontrada o inactiva.`)
    return sede
  }
}
