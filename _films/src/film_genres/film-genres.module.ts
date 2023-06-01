
import { Module } from '@nestjs/common';
import { FilmGenresService } from './film-genres.service';
import { FilmGenre } from './film-genres.struct';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    providers: [FilmGenresService],
    imports: [SequelizeModule.forFeature([FilmGenre])],
    exports: [FilmGenresService],
})
export class FilmGenresModule {}
