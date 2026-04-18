import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { DiscoveryService } from './discovery.service';
import { PublicDoctorQueryDto } from './dto/public-doctor-query.dto';

@ApiTags('Public')
@Controller('public')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get('home')
  @ApiOperation({ summary: 'Public home endpoint' })
  getHome() {
    return this.discoveryService.getHome();
  }

  @Get('specialties')
  @ApiOperation({ summary: 'Public specialties list' })
  listSpecialties() {
    return this.discoveryService.listPublicSpecialties();
  }

  @Get('doctors')
  @ApiOperation({ summary: 'Public doctor discovery list' })
  listDoctors(@Query() query: PublicDoctorQueryDto) {
    return this.discoveryService.listPublicDoctors(query);
  }

  @Get('doctors/:doctorId')
  @ApiOperation({ summary: 'Public doctor detail' })
  async getDoctorDetail(@Param('doctorId') doctorId: string) {
    const doctor = await this.discoveryService.getPublicDoctorById(doctorId);
    if (!doctor) {
      throw new NotFoundException('Doctor not found or not publicly available');
    }
    return doctor;
  }
}
