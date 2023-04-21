
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MembersModule } from 'src/members/members.module';
import { ProfessionsController } from './professions.controller';
import { ProfessionsService } from './professions.service';
import { Profession } from './professions.struct';

@Module( {
    controllers: [ ProfessionsController ],
    providers: [ ProfessionsService ],
    imports:
        [
            SequelizeModule.forFeature( [ Profession ] ),

            MembersModule
        ]
} )
export class ProfessionsModule { }
