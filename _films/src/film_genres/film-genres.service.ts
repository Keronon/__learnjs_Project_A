
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Film_genres :`, data, colors.reset);

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilmGenre } from './film-genres.struct';

@Injectable()
export class FilmGenresService {
    constructor(@InjectModel(FilmGenre) private filmGenresDB: typeof FilmGenre) {}

    async createFilmGenres(idFilm: number, arrIdGenres: number[]): Promise<number> {
        log('createFilmGenres');

        for (let idGenre of arrIdGenres) {
            await this.filmGenresDB.create({ idFilm, idGenre });
        }

        return arrIdGenres.length;
    }

    async getFilteredFilmsByGenres(arrIdGenres: number[], arrIdFilms: number[]): Promise<number[]> {
        log('getFilteredFilmsByGenres');

        const condition = [];
        if (arrIdFilms) condition.push({ idFilm: arrIdFilms });
        condition.push({ idGenre: arrIdGenres });

        const found = await this.filmGenresDB.findAll({
            attributes: ['idFilm'],
            where: condition,
        });

        return found.map((v) => v.idFilm);
    }

    async deleteFilmGenres(idFilm: number): Promise<number> {
        log('deleteFilmGenres');
        return await this.filmGenresDB.destroy({ where: { idFilm } });
    }

    async checkExistenceFilmGenreByGenreId(idGenre: number): Promise<Boolean> {
        log('checkExistenceFilmGenreByGenreId');

        const count = await this.filmGenresDB.count({ where: { idGenre } });
        return count > 0 ? true : false;
    }
}
