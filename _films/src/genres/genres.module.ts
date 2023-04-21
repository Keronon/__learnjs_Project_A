
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CountriesModule } from 'src/countries/countries.module';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { Genre } from './genres.struct';
import { FilmGenre } from './film-genres.struct';

@Module({
    controllers: [GenresController],
    providers: [GenresService],
    imports:
    [
        SequelizeModule.forFeature([Genre, FilmGenre]),

        CountriesModule
    ],
    exports: [GenresService],
})
export class GenresModule {}
