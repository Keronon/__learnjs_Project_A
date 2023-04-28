
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Films :`, data, colors.reset);

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GenresService } from '../genres/genres.service';
import { CountriesService } from '../countries/countries.service';
import { FilmGenresService } from '../film_genres/film-genres.service';
import { Film } from './films.struct';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { QueueNames, RMQ } from '../rabbit.core';
import { FilmsRMQ } from './films-rmq';

@Injectable()
export class FilmsService {
    private filmsRMQ: FilmsRMQ;

    constructor(
        @InjectModel(Film) private filmsDB: typeof Film,
        private countriesService: CountriesService,
        private genresService: GenresService,
        private filmGenresService: FilmGenresService,
    ) {
        RMQ.connect().then(RMQ.setCmdConsumer(this, QueueNames.CF_cmd, QueueNames.CF_data));
        this.filmsRMQ = new FilmsRMQ(this.filmsDB);
    }

    async getFilmById(id: number): Promise<Film> {
        log('getFilmById');
        return await this.filmsDB.findByPk(id);
    }

    async createFilm(createFilmDto: CreateFilmDto): Promise<Film> {
        log('createFilm');

        await this.validateCountryAndGenres(createFilmDto.idCountry, createFilmDto.arrIdGenres);

        const film = await this.filmsDB.create(createFilmDto);

        await this.filmsRMQ.createFilmInfo(film.id, createFilmDto);
        await this.filmsRMQ.createRatingFilm(film.id);
        await this.filmGenresService.createFilmGenres(film.id, createFilmDto.arrIdGenres);

        return film;
    }

    async updateFilm(updateFilmDto: UpdateFilmDto): Promise<Film> {
        log('updateFilm');

        const film = await this.getFilmById(updateFilmDto.id);
        if (!film) {
            throw new NotFoundException({ message: 'Film not found' });
        }

        await this.validateCountryAndGenres(updateFilmDto.idCountry, updateFilmDto.arrIdGenres);

        for (let key in updateFilmDto) {
            if (key === 'arrIdGenres') break;
            film[key] = updateFilmDto[key];
        }
        await film.save();

        await this.filmGenresService.deleteFilmGenres(film.id);
        await this.filmGenresService.createFilmGenres(film.id, updateFilmDto.arrIdGenres);

        return film;
    }

    // TODO : сделать добавление/изменение фото

    async deleteFilmById(id: number): Promise<number> {
        log('deleteFilmById');

        const film = await this.getFilmById(id);
        if (!film) {
            throw new NotFoundException({ message: 'Film not found' });
        }

        await this.filmsRMQ.deleteFilmInfo(id);
        await this.filmsRMQ.deleteRatingFilm(id);

        // TODO : delete filmUsers, comments

        return await this.filmsDB.destroy({ where: { id } });
    }

    async checkExistenceFilmById(id: number) {
        log('checkExistenceFilm');
        return (await this.getFilmById(id)) ? true : false;
    }

    private async validateCountryAndGenres(idCountry: number, arrIdGenres: number[]): Promise<void> {
        log('validateCountryAndGenres');

        const country = await this.countriesService.getCountryById(idCountry);
        if (!country) {
            throw new NotFoundException({ message: 'Country not found' });
        }

        for (let [index, idGenre] of arrIdGenres.entries()) {
            const genre = await this.genresService.getGenreById(idGenre);
            if (!genre) {
                throw new NotFoundException({ message: `Genre with id = ${idGenre} not found` });
            }

            if(arrIdGenres.indexOf(idGenre) !== index){
                throw new ConflictException({ message: `Genre with id = ${idGenre} is repeated several times` });
            };
        }
    }
}
