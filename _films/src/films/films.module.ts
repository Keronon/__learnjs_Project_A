
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CountriesModule } from '../countries/countries.module';
import { GenresModule } from '../genres/genres.module';
import { FilmGenresModule } from '../film_genres/film-genres.module';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { Film } from './films.struct';

@Module({
    controllers: [FilmsController],
    providers: [FilmsService],
    imports: [
        SequelizeModule.forFeature([Film]),

        CountriesModule,
        GenresModule,
        FilmGenresModule,
        FilmGenresModule,
    ],
    exports: [FilmsService],
})
export class FilmsModule {}
