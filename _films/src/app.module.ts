
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtGlobalModule } from './jwt.module';
import { FilmsModule } from './films/films.module';
import { GenresModule } from './genres/genres.module';
import { CountriesModule } from './countries/countries.module';
import { FilmGenresModule } from './film_genres/film-genres.module';
import { Film } from './films/films.struct';
import { Genre } from './genres/genres.struct';
import { Country } from './countries/countries.struct';
import { FilmGenre } from './film_genres/film-genres.struct';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
    controllers: [],
    providers: [],
    imports: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.PG_HOST || 'localhost',
            port: +process.env.PG_PORT,
            username: process.env.PG_USER,
            password: process.env.PG_PASS,
            database: process.env.PG_DB,
            models: [Film, Genre, FilmGenre, Country],
            autoLoadModels: true,
            logging: false,
        }),

        ServeStaticModule.forRoot( { rootPath: '/root/_files', serveRoot: '/api/films/images'} ),

        JwtGlobalModule,
        FilmsModule,
        GenresModule,
        CountriesModule,
        FilmGenresModule,
    ],
})
export class AppModule {}
