import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GenresService } from './../genres/genres.service';
import { CountriesService } from './../countries/countries.service';
import { Film } from './films.struct';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@Injectable()
export class FilmsService {
    constructor(
        @InjectModel(Film) private filmsDB: typeof Film,
        private countriesService: CountriesService,
        private genresService: GenresService,
    ) {}

    async getFilmById(id: number): Promise<Film> {
        return await this.filmsDB.findByPk(id);
    }

    async createFilm(createFilmDto: CreateFilmDto): Promise<Film> {
        const country = await this.countriesService.getCountryById(createFilmDto.idCountry);
        if (!country) {
            throw new BadRequestException({ message: 'Country not found' });
        }
 
        createFilmDto.arrIdGenres.forEach(async (item) => {
            const genre = await this.genresService.getGenreById(item);
            if (!genre) {
                throw new BadRequestException({ message: `Genre with id = ${item} not found` });
            }
        });

        const filmInfoData = {

        };

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
