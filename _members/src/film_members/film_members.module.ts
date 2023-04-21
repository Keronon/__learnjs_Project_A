
import { Module } from '@nestjs/common';
import { FilmMembersController } from './film_members.controller';
import { FilmMembersService } from './film_members.service';

@Module( {
    controllers: [ FilmMembersController ],
    providers: [ FilmMembersService ]
} )
export class FilmMembersModule { }
