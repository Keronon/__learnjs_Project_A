
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfessionsController } from './professions.controller';
import { ProfessionsService } from './professions.service';
import { Profession } from './professions.struct';
import { FilmMembersModule } from '../film_members/film_members.module';

@Module({
    controllers: [ProfessionsController],
    providers: [ProfessionsService],
    imports: [
        SequelizeModule.forFeature([Profession]),
        FilmMembersModule
    ],
    exports: [ProfessionsService],
})
export class ProfessionsModule {}
