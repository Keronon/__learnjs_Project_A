
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Countries :`, data, colors.reset);

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilmsService } from '../films/films.service';
import { Country } from './countries.struct';
import { CreateCountryDto } from './dto/create-country.dto';
import { Op } from 'sequelize';

@Injectable()
export class CountriesService {
    constructor(
        @InjectModel(Country) private countriesDB: typeof Country,
        private filmsService: FilmsService,
    ) {}

    async getAllCountries(): Promise<Country[]> {
        log('getAllCountries');
        return await this.countriesDB.findAll();
    }

    async getCountryById(id: number): Promise<Country> {
        log('getCountryById');
        return await this.countriesDB.findByPk(id);
    }

    async createCountry(createCountryDto: CreateCountryDto): Promise<Country> {
        log('createCountry');

        if (await this.checkExistenceName(createCountryDto.nameRU, createCountryDto.nameEN)) {
            throw new ConflictException({ message: 'This country name already exists' });
        }

        return await this.countriesDB.create(createCountryDto);
    }

    async deleteCountryById(id: number): Promise<number> {
        log('deleteCountryById');

        const country = await this.getCountryById(id);
        if (!country) {
            throw new NotFoundException({ message: 'Country not found' });
        }

        if (await this.filmsService.checkExistenceFilmByCountryId(id)) {
            throw new ConflictException({ message: 'Can not delete country (films refer to it)' });
        }

        return await this.countriesDB.destroy({ where: { id } });
    }

    private async checkExistenceName(nameRU: string, nameEN: string) {
        log('checkExistenceName');

        const count = await this.countriesDB.count({
            where: {
                [Op.or]: [{ nameRU }, { nameEN }],
            },
        });

        return count > 0 ? true : false;
    }
}
