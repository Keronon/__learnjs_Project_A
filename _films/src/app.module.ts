import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { FilmsModule } from './films/films.module';
import { GenresModule } from './genres/genres.module';
import { CountriesModule } from './countries/countries.module';
import { Film } from './films/films.struct';
import { Genre } from './genres/genres.struct';
import { Country } from './countries/countries.struct';
import { FilmGenre } from './genres/film-genres.struct';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env' }),

        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.PG_HOST || 'pg',
            port: Number(process.env.PG_PORT) || 5432,
            username: process.env.PG_USER || 'postgres',
            password: process.env.PG_PASS || 'root',
            database: process.env.PG_DB || 'DB_films',
            models: [Film, Genre, FilmGenre, Country],
            autoLoadModels: true,
            logging: false,
        }),

        FilmsModule,
        GenresModule,
        CountriesModule,
    ],
})
export class AppModule {}
