
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Genres :`, data, colors.reset);

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Genre } from './genres.struct';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenresService {
    constructor(@InjectModel(Genre) private genresDB: typeof Genre) {}

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

        const country = await this.getGenreById(id);
        if (!country) {
            throw new NotFoundException({ message: 'Genre not found' });
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
