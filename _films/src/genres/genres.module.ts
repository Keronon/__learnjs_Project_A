
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { Genre } from './genres.struct';
import { FilmGenresModule } from '../film_genres/film-genres.module';

@Module({
    controllers: [GenresController],
    providers: [GenresService],
    imports: [
        SequelizeModule.forFeature([Genre]),
        FilmGenresModule
    ],
    exports: [GenresService],
})
export class GenresModule {}
