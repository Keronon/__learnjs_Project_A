
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Films :`, data, colors.reset);

import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GenresService } from '../genres/genres.service';
import { CountriesService } from '../countries/countries.service';
import { FilmGenresService } from '../film_genres/film-genres.service';
import { Film } from './films.struct';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { UpdateFilmRatingDto } from './dto/update-film-rating.dto';
import { QueueNames, RMQ } from '../rabbit.core';
import { FilmsRMQ } from './films-rmq';
import { addFile, deleteFile, getFile } from '../files.core';

@Injectable()
export class FilmsService {
    private filmsRMQ: FilmsRMQ;

    constructor(
        @InjectModel(Film) private filmsDB: typeof Film,

        @Inject(forwardRef(() => CountriesService))
        private countriesService: CountriesService,

        private genresService: GenresService,
        private filmGenresService: FilmGenresService,
    ) {
        RMQ.connect()
            .then(RMQ.setCmdConsumer(this, QueueNames.CF_cmd, QueueNames.CF_data))
            .then(RMQ.setCmdConsumer(this, QueueNames.RF_cmd, QueueNames.RF_data));

        this.filmsRMQ = new FilmsRMQ(this.filmsDB);
    }

    async getSimpleFilmById(id: number): Promise<Film> {
        log('getSimpleFilmById');
        return await this.filmsDB.findByPk(id);
    }

    async getFilmById(id: number): Promise<any> {
        log('getFilmById');
        return this.setImageAsFile(await this.getSimpleFilmById(id));
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

    async updateFilm(updateFilmDto: UpdateFilmDto, image: any): Promise<Film> {
        log('updateFilm');

        let film = await this.getSimpleFilmById(updateFilmDto.id);
        if (!film) {
            throw new NotFoundException({ message: 'Film not found' });
        }

        await this.validateCountryAndGenres(updateFilmDto.idCountry, updateFilmDto.arrIdGenres);

        for (let key in updateFilmDto) {
            if (key === 'arrIdGenres') break;
            film[key] = updateFilmDto[key];
        }
        if (image) {
            deleteFile(film.imageName);
            film.imageName = addFile(image);
        }
        film = await film.save();

        await this.filmGenresService.deleteFilmGenres(film.id);
        await this.filmGenresService.createFilmGenres(film.id, updateFilmDto.arrIdGenres);

        return film;
    }

    async updateImageById(id: number, image: any): Promise<any> {
        log('updateImageById');

        let film = await this.getSimpleFilmById(id);

        if (!image) throw new BadRequestException({ message: 'No image to set' });

        if (film.imageName) deleteFile(film.imageName);

        film.imageName = addFile(image);
        film = await film.save();

        return this.setImageAsFile(film);
    }

    async updateFilmRating(updateFilmRatingDto: UpdateFilmRatingDto): Promise<Boolean> {
        log('updateFilmRating');

        const film = await this.getSimpleFilmById(updateFilmRatingDto.id);
        if (!film) {
            throw new NotFoundException({ message: 'Film not found' });
        }

        film.rating = updateFilmRatingDto.newRating;
        await film.save();

        return true;
    }

    async deleteFilmById(id: number): Promise<number> {
        log('deleteFilmById');

        const film = await this.getSimpleFilmById(id);
        if (!film) {
            throw new NotFoundException({ message: 'Film not found' });
        }

        await this.filmsRMQ.deleteFilmInfo(id);
        await this.filmsRMQ.deleteRatingFilm(id);
        await this.filmsRMQ.deleteRatingUsers(id);
        await this.filmsRMQ.deleteFilmComments(id);
        await this.filmsRMQ.deleteFilmMembers(id);

        return await this.filmsDB.destroy({ where: { id } });
    }

    async checkExistenceFilmById(id: number): Promise<Boolean> {
        log('checkExistenceFilm');
        return (await this.getFilmById(id)) ? true : false;
    }

    async checkExistenceFilmByCountryId(idCountry: number): Promise<Boolean> {
        log('checkExistenceFilmByCountryId');

        const count = await this.filmsDB.count({ where: { idCountry } });
        return count > 0 ? true : false;
    }

    private setImageAsFile(film: Film) {
        log('setImageAsFile');

        const image = film.imageName ? getFile(film.imageName) : null;
        const data = {
            ...film.dataValues,
            image,
        };
        delete data.imageName;

        return data;
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

            if (arrIdGenres.indexOf(idGenre) !== index) {
                throw new ConflictException({ message: `Genre with id = ${idGenre} is repeated several times` });
            }
        }
    }
}
