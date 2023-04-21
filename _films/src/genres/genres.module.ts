import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Genre } from './genres.struct';
import { FilmGenre } from './film-genres.struct';

@Module({
    controllers: [GenresController],
    providers: [GenresService],
    imports: [SequelizeModule.forFeature([Genre, FilmGenre])],
    exports: [GenresService],
})
export class GenresModule {}
