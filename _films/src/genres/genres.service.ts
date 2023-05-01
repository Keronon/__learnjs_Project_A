
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Genres :`, data, colors.reset);

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Genre } from './genres.struct';
import { CreateGenreDto } from './dto/create-genre.dto';
import { FilmGenresService } from '../film_genres/film-genres.service';

@Injectable()
export class GenresService {
    constructor(
        @InjectModel(Genre) private genresDB: typeof Genre,
        private filmGenresService: FilmGenresService,
    ) {}

    async getAllGenres(): Promise<Genre[]> {
        log('getAllGenres');
        return await this.genresDB.findAll();
    }

    async getGenreById(id: number): Promise<Genre> {
        log('getGenreById');
        return await this.genresDB.findByPk(id);
    }

    async createGenre(createGenreDto: CreateGenreDto): Promise<Genre> {
        log('createGenre');

        if (await this.checkExistenceName(createGenreDto.nameRU, createGenreDto.nameEN)) {
            throw new ConflictException({ message: 'This genre name already exists' });
        }

        return await this.genresDB.create(createGenreDto);
    }

    async deleteGenreById(id: number): Promise<number> {
        log('deleteGenreById');

        const genre = await this.getGenreById(id);
        if (!genre) {
            throw new NotFoundException({ message: 'Genre not found' });
        }

        if (await this.filmGenresService.checkExistenceFilmGenreByGenreId(id)) {
            throw new ConflictException({ message: 'Can not delete genre (films refer to it)' });
        }

        return await this.genresDB.destroy({ where: { id } });
    }

    private async checkExistenceName(nameRU: string, nameEN: string) {
        log('checkExistenceName');

        const count = await this.genresDB.count({
            where: {
                [Op.or]: [{ nameRU }, { nameEN }],
            },
        });

        return count > 0 ? true : false;
    }
}
