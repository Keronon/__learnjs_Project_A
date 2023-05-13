
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Films :`, data, colors.reset);

import { BadRequestException,
         ConflictException,
         Inject,
         Injectable,
         NotFoundException,
         forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { QueueNames, RMQ } from '../rabbit.core';
import { FilmsRMQ } from './films-rmq';
import { addFile, deleteFile, getFile } from '../files.core';
import { GenresService } from '../genres/genres.service';
import { CountriesService } from '../countries/countries.service';
import { FilmGenresService } from '../film_genres/film-genres.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { UpdateFilmRatingDto } from './dto/update-film-rating.dto';
import { GetFilmDto } from './dto/get-film.dto';
import { GetMemberFilmDto } from './dto/get-member-film.dto';
import { FilmFiltersDto } from './dto/film-filters.dto';
import { Film } from './films.struct';
import { TypesSorting } from './types-sorting';

@Injectable()
export class FilmsService {
    private filmsRMQ: FilmsRMQ;
    private readonly countInPart: number;

    constructor(
        @InjectModel(Film) private filmsDB: typeof Film,
        @Inject(forwardRef(() => CountriesService)) private countriesService: CountriesService,
        private genresService: GenresService,
        private filmGenresService: FilmGenresService,
    ) {
        RMQ.connect()
            .then(RMQ.setCmdConsumer(this, QueueNames.CF_cmd, QueueNames.CF_data))
            .then(RMQ.setCmdConsumer(this, QueueNames.RF_cmd, QueueNames.RF_data))
            .then(RMQ.setCmdConsumer(this, QueueNames.FMF_cmd, QueueNames.FMF_data));

        this.filmsRMQ = new FilmsRMQ(this.filmsDB);
        this.countInPart = 35;
    }

    async getSimpleFilmById(id: number): Promise<Film> {
        log('getSimpleFilmById');
        return await this.filmsDB.findByPk(id);
    }

    async getFilmById(id: number): Promise<GetFilmDto> {
        log('getFilmById');

        const film = await this.filmsDB.findOne({
            where: { id },
            include: { all: true },
        });
        return this.setImageAsFile(film);
    }

    async getAllFilms(part: number): Promise<GetFilmDto[]> {
        log('getAllFilms');

        const films = await this.filmsDB.findAll({
            include: { all: true },
            offset: (part - 1) * this.countInPart,
            limit: this.countInPart
        });
        return films.map((v) => this.setImageAsFile(v));
    }

    async getMemberFilms(idMember: number): Promise<GetMemberFilmDto[]> {
        log('getMemberFilms');

        const res: GetMemberFilmDto[] = [];

        const films = await this.filmsRMQ.getMemberFilms(idMember);

        for (let i = 0; i < films.length; i++) {
            res.push({
                film: await this.getFilmById(films[i].idFilm),
                profession: films[i].profession,
            });
        }

        return res;
    }

    async getFilteredFilms(filmFiltersDto: FilmFiltersDto): Promise<GetFilmDto[]> {
        log('getFilteredFilms');

        let arrIdFilms;
        if (filmFiltersDto.arrMembersFilterDto) {
            arrIdFilms = await this.filmsRMQ.getFilteredFilmsByMembers(filmFiltersDto.arrMembersFilterDto);
            if (!arrIdFilms.length) return [];
        }

        if (filmFiltersDto.arrIdGenres) {
            arrIdFilms = await this.filmGenresService.getFilteredFilmsByGenres(filmFiltersDto.arrIdGenres, arrIdFilms);
            if (!arrIdFilms.length) return [];
        }

        const condition = [];
        if (arrIdFilms) condition.push({ id: arrIdFilms });
        if (filmFiltersDto.ratingStart) {
            condition.push({ rating: { [Op.gte]: filmFiltersDto.ratingStart } });
        }
        if (filmFiltersDto.countRatingStart) {
            condition.push({ countRating: { [Op.gte]: filmFiltersDto.countRatingStart } });
        }
        if (filmFiltersDto.arrIdCountries) condition.push({ idCountry: filmFiltersDto.arrIdCountries });

        const order = this.getValueOrder(filmFiltersDto.typeSorting);

        const films = await this.filmsDB.findAll({
            include: { all: true },
            where: { [Op.and]: condition },
            order: order,
            offset: (filmFiltersDto.part - 1) * this.countInPart,
            limit: this.countInPart
        });

        return films.map((v) => this.setImageAsFile(v));
    }

    async createFilm(createFilmDto: CreateFilmDto): Promise<Film> {
        log('createFilm');

        await this.validateCountryAndGenres(createFilmDto.idCountry, createFilmDto.arrIdGenres);

        const film = await this.filmsDB.create({...createFilmDto, rating: 0, countRating: 0});

        await this.filmsRMQ.createFilmInfo(film.id, createFilmDto);
        await this.filmGenresService.createFilmGenres(film.id, createFilmDto.arrIdGenres);

        return film;
    }

    async updateFilm(updateFilmDto: UpdateFilmDto): Promise<Film> {
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
        film = await film.save();

        await this.filmGenresService.deleteFilmGenres(film.id);
        await this.filmGenresService.createFilmGenres(film.id, updateFilmDto.arrIdGenres);

        return film;
    }

    async updateImageById(id: number, image: any): Promise<any> {
        log('updateImageById');

        let film = await this.getSimpleFilmById(id);
        if (!film) throw new NotFoundException({ message: 'Film not found' });

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

        let sumRatings: number;
        if (!updateFilmRatingDto.oldRatingUser) {
            sumRatings = film.rating * film.countRating + updateFilmRatingDto.newRatingUser;
            film.countRating++;
        } else {
            sumRatings = film.rating * film.countRating -
                         updateFilmRatingDto.oldRatingUser +
                         updateFilmRatingDto.newRatingUser;
        }

        film.rating = sumRatings / film.countRating;
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
        await this.filmsRMQ.deleteRatingUsers(id);
        await this.filmsRMQ.deleteFilmComments(id);
        await this.filmsRMQ.deleteFilmMembers(id);

        return await this.filmsDB.destroy({ where: { id } });
    }

    async checkExistenceFilmById(id: number): Promise<Boolean> {
        log('checkExistenceFilm');
        return (await this.getSimpleFilmById(id)) ? true : false;
    }

    async checkExistenceFilmByCountryId(idCountry: number): Promise<Boolean> {
        log('checkExistenceFilmByCountryId');

        const count = await this.filmsDB.count({ where: { idCountry } });
        return count > 0 ? true : false;
    }

    private setImageAsFile(film: Film): any {
        log('setImageAsFile');

        const image = film.imageName ? getFile(film.imageName) : null;
        const data = {
            ...film.dataValues,
            rating: Math.round(film.rating * 10) / 10,
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

    private getValueOrder(typeSorting: string) {
        const order = [];

        switch (typeSorting) {
            case TypesSorting.rating:
                order.push(['rating', 'DESC']);
                break;
            case TypesSorting.countRating:
                order.push(['countRating', 'DESC']);
                break;
            case TypesSorting.year:
                order.push(['year', 'DESC']);
                break;
            case TypesSorting.alphabetRU:
                order.push(['nameRU', 'ASC']);
                break;
            case TypesSorting.alphabetEN:
                order.push(['nameEN', 'ASC']);
                break;
        }

        return order;
    }
}
