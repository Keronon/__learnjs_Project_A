
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfessionsController } from './professions.controller';
import { ProfessionsService } from './professions.service';
import { Profession } from './professions.struct';

@Module({
    controllers: [ProfessionsController],
    providers: [ProfessionsService],
    imports: [SequelizeModule.forFeature([Profession])],
    exports: [ProfessionsService],
})
export class ProfessionsModule {}
