
import { Module } from '@nestjs/common';
import { ProfessionsController } from './professions.controller';
import { ProfessionsService } from './professions.service';

@Module({
  controllers: [ProfessionsController],
  providers: [ProfessionsService]
})
export class ProfessionsModule {}
