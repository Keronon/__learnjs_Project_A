
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Genre } from './genres.struct';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenresService {
    constructor(@InjectModel(Genre) private genresDB: typeof Genre) {}

    async getAllGenres(): Promise<Genre[]> {
        return await this.genresDB.findAll();
    }

    async getGenreById(id: number): Promise<Genre> {
        return await this.genresDB.findByPk(id);
    }

    async createGenre(createGenreDto: CreateGenreDto): Promise<Genre> {
        if (await this.CheckExistenceName(createGenreDto.nameRU, createGenreDto.nameEN)) {
            throw new BadRequestException({ message: 'This genre name already exists' });
        }

        return await this.genresDB.create(createGenreDto);
    }

    async deleteGenreById(id: number): Promise<number> {
        const country = await this.getGenreById(id);
        if (!country) {
            throw new BadRequestException({ message: 'Genre not found' });
        }

        return await this.genresDB.destroy({ where: { id } });
    }

    private async CheckExistenceName(nameRU: string, nameEN: string) {
        const count = await this.genresDB.count({
            where: {
                [Op.or]: [{ nameRU }, { nameEN }],
            },
        });

        return count > 0 ? true : false;
    }
}
