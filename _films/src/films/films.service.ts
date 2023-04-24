
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > S-Films :`, data, colors.reset );

import * as uuid from 'uuid';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GenresService } from './../genres/genres.service';
import { CountriesService } from './../countries/countries.service';
import { Film } from './films.struct';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { QueueNames, RMQ } from './../rabbit.core';

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
        log('getFilmById');
        return await this.filmsDB.findByPk(id);
    }

    // TODO : сделать добавление жанров и фото
    // TODO : создание записи в rating-films

    async createFilm(createFilmDto: CreateFilmDto): Promise<Film> {
        log('createFilm');

        const country = await this.countriesService.getCountryById(createFilmDto.idCountry);
        if (!country) {
            throw new BadRequestException({ message: 'Country not found' });
        }

        for (const idGenre of createFilmDto.arrIdGenres)
        {
            const genre = await this.genresService.getGenreById(idGenre);
            if (!genre) {
                throw new BadRequestException({ message: `Genre with id = ${idGenre} not found` });
            }
        }

        const film = await this.filmsDB.create(createFilmDto);

        const filmInfoData = {
            text: createFilmDto.text,
            trailerLink: createFilmDto.trailerLink,
            idFilm: film.id,
        };

        // ! filmInfoData -> FilmInfo -> filmInfo
        const id_msg = uuid.v4();
        const res = await RMQ.publishReq(QueueNames.FFI_cmd, QueueNames.FFI_data, {
            id_msg: id_msg,
            cmd: 'createFilmInfo',
            data: filmInfoData,
        });
        if (res !== 1)
        {
            await this.filmsDB.destroy({ where: { id: film.id } });
            throw new ConflictException({message: 'Can not create film info'});
        }

        return res;
    }

    async updateFilm(updateFilmDto: UpdateFilmDto): Promise<Film> {
        log('updateFilm');

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
        log('deleteFilmById');

        const film = await this.getFilmById(id);
        if (!film) {
            throw new BadRequestException({ message: 'Film not found' });
        }

        // ! idFilm -> FilmInfo -> rows count
        const id_msg = uuid.v4();
        const res = await RMQ.publishReq(QueueNames.FFI_cmd, QueueNames.FFI_cmd, {
            id_msg: id_msg,
            cmd: 'deleteFilmInfoByFilmId',
            data: film.id,
        });
        if (res !== 1) throw new ConflictException({message: 'Can not delete film info'});

        return await this.filmsDB.destroy({ where: { id } });
    }
}
