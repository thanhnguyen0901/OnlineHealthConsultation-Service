import { PartialType } from '@nestjs/swagger';

import { UpdateDoctorProfileDto } from './update-doctor-profile.dto';

export class AdminUpdateDoctorProfileDto extends PartialType(UpdateDoctorProfileDto) {}
