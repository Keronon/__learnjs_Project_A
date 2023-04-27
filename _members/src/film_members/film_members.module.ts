
import { Module } from '@nestjs/common';
import { FilmMembersController } from './film_members.controller';
import { FilmMembersService } from './film_members.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilmMember } from './film_members.struct';

@Module({
    controllers: [FilmMembersController],
    providers: [FilmMembersService],
    imports: [SequelizeModule.forFeature([FilmMember])],
    exports: [FilmMembersService],
})
export class FilmMembersModule {}
