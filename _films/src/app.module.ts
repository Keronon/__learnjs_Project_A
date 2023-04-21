
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { FilmsModule } from './films/films.module';
import { GenresModule } from './genres/genres.module';
import { CountriesModule } from './countries/countries.module';
import { MembersModule } from './members/members.module';
import { ProfessionsModule } from './professions/professions.module';
import { Film } from './films/films.model';
import { Genre } from './genres/genres.model';
import { Country } from './countries/countries.model';
import { Member } from './members/members.model';
import { Profession } from './professions/professions.model';
import { FilmGenre } from './genres/film-genres.model';

@Module( {
    controllers: [],
    providers: [],
    imports:
    [
        ConfigModule.forRoot({ envFilePath: '.env' }),

        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.PG_HOST || 'pg',
            port: Number(process.env.PG_PORT) || 5432,
            username: process.env.PG_USER || 'postgres',
            password: process.env.PG_PASS || 'root',
            database: process.env.PG_DB || 'DB_films',
            models: [Film, Genre, FilmGenre, Country], //Member, Profession],
            autoLoadModels: true,
            logging: false
        }),

        FilmsModule,
        GenresModule,
        CountriesModule,
        MembersModule,
        ProfessionsModule
    ],
} )
export class AppModule { }
