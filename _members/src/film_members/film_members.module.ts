
import { Module } from '@nestjs/common';
import { FilmMembersController } from './film_members.controller';
import { FilmMembersService } from './film_members.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilmMember } from './film_members.struct';
import { MembersModule } from '../members/members.module';

@Module({
    controllers: [FilmMembersController],
    providers: [FilmMembersService],
    imports: [
        SequelizeModule.forFeature([FilmMember]),
        MembersModule
    ],
    exports: [FilmMembersService],
})
export class FilmMembersModule {}
