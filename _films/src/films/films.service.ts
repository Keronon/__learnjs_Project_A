
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Film } from './films.struct';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@Injectable()
export class FilmsService {
    constructor(@InjectModel(Film) private filmsDB: typeof Film) {}

    async getFilmById(id: number): Promise<Film> {
        return await this.filmsDB.findByPk(id);
    }

    async createFilm(createFilmDto: CreateFilmDto): Promise<Film> {
        return await this.filmsDB.create(createFilmDto);
    }

    async updateFilm(updateFilmDto: UpdateFilmDto): Promise<Film> {
        const film = await this.getFilmById(updateFilmDto.id);
        if (!film) {
            throw new BadRequestException({ message: 'Film not found' });
        }

        for (let key in updateFilmDto) {
            film[key] = updateFilmDto[key];
        }
        await film.save();

        return film;
    }

    async deleteFilmById(id: number): Promise<number> {
        const film = await this.getFilmById(id);
        if (!film) {
            throw new BadRequestException({ message: 'Film not found' });
        }

        return await this.filmsDB.destroy({ where: { id } });
    }
}
