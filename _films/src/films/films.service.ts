import * as uuid from 'uuid';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GenresService } from './../genres/genres.service';
import { CountriesService } from './../countries/countries.service';
import { Film } from './films.struct';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { RMQ } from './../rabbit.core';

@Injectable()
export class FilmsService {
    constructor(
        @InjectModel(Film) private filmsDB: typeof Film,
        private countriesService: CountriesService,
        private genresService: GenresService,
    ) {
        RMQ.connect();
    }

    async getFilmById(id: number): Promise<Film> {
        return await this.filmsDB.findByPk(id);
    }

    // TODO : сделать добавление жанров и фото

    async createFilm(createFilmDto: CreateFilmDto): Promise<Film> {
        const country = await this.countriesService.getCountryById(createFilmDto.idCountry);
        if (!country) {
            throw new BadRequestException({ message: 'Country not found' });
        }

        // FIXME : Не выводится ошибка
        createFilmDto.arrIdGenres.forEach(async (item) => {
            const genre = await this.genresService.getGenreById(item);
            if (!genre) {
                throw new BadRequestException({ message: `Genre with id = ${item} not found` });
            }
        });

        const film = await this.filmsDB.create(createFilmDto);

        const filmInfoData = {
            text: createFilmDto.text,
            trailerLink: createFilmDto.trailerLink,
            idFilm: film.id,
        };

        // ! create film info -> FilmInfo
        const id_msg = uuid.v4();
        await RMQ.publishReq({
            id_msg: id_msg,
            cmd: 'createFilmInfo',
            data: filmInfoData,
        });

        return film;
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

    async deleteFilmById(id: number): Promise<boolean> {
        const film = await this.getFilmById(id);
        if (!film) {
            throw new BadRequestException({ message: 'Film not found' });
        }

        await this.filmsDB.destroy({ where: { id } });

        // ! del film info -> FilmInfo
        const id_msg = uuid.v4();
        await RMQ.publishReq({
            id_msg: id_msg,
            cmd: 'deleteFilmInfoByFilmId',
            data: film.id,
        });

        return true;
    }
}
