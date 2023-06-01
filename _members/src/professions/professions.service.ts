
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Professions :`, data, colors.reset);

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Profession } from './professions.struct';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { FilmMembersService } from '../film_members/film_members.service';

@Injectable()
export class ProfessionsService {
    constructor(
        @InjectModel(Profession) private professionsDB: typeof Profession,
        private filmMembersService: FilmMembersService,
    ) {}

    async createProfession(createProfessionDto: CreateProfessionDto): Promise<Profession> {
        log('createProfession');

        if (await this.checkExistenceName(createProfessionDto.nameRU, createProfessionDto.nameEN)) {
            throw new ConflictException({ message: 'This profession already exists' });
        }

        return await this.professionsDB.create(createProfessionDto);
    }

    async getAllProfessions(): Promise<Profession[]> {
        log('getAllProfessions');
        return await this.professionsDB.findAll();
    }

    async getProfessionById(id: number): Promise<Profession> {
        log('getProfessionById');
        return await this.professionsDB.findByPk(id);
    }

    async deleteProfession(id: number): Promise<number> {
        log('deleteProfession');

        const profession = await this.getProfessionById(id);
        if (!profession) {
            throw new NotFoundException({ message: 'Profession not found' });
        }

        if (await this.filmMembersService.checkExistenceFilmMemberByProfessionId(id)) {
            throw new ConflictException({ message: 'Can not delete profession (film member refer to it)' });
        }

        return this.professionsDB.destroy({ where: { id } });
    }

    private async checkExistenceName(nameRU: string, nameEN: string) {
        log('checkExistenceName');

        const count = await this.professionsDB.count({
            where: {
                [Op.or]: [{ nameRU }, { nameEN }],
            },
        });

        return count > 0 ? true : false;
    }
}
