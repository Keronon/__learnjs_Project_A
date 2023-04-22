
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Country } from './countries.struct';
import { CreateCountryDto } from './dto/create-country.dto';
import { Op } from 'sequelize';

@Injectable()
export class CountriesService {
    constructor(@InjectModel(Country) private countriesDB: typeof Country) {}

    async getAllCountries(): Promise<Country[]> {
        return await this.countriesDB.findAll();
    }

    async getCountryById(id: number): Promise<Country> {
        return await this.countriesDB.findByPk(id);
    }

    async createCountry(createCountryDto: CreateCountryDto): Promise<Country> {
        if (await this.CheckExistenceName(createCountryDto.nameRU, createCountryDto.nameEN)) {
            throw new BadRequestException({ message: 'This country name already exists' });
        }

        return await this.countriesDB.create(createCountryDto);
    }

    // TODO : контролировать каскадное удаление фильмов по стране
    async deleteCountryById(id: number): Promise<number> {
        const country = await this.getCountryById(id);
        if (!country) {
            throw new BadRequestException({ message: 'Country not found' });
        }

        return await this.countriesDB.destroy({ where: { id } });
    }

    private async CheckExistenceName(nameRU: string, nameEN: string) {
        const count = await this.countriesDB.count({
            where: {
                [Op.or]: [{ nameRU }, { nameEN }],
            },
        });

        return count > 0 ? true : false;
    }
}
