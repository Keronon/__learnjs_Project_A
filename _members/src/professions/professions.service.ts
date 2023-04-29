
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Professions :`, data, colors.reset);

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Profession } from './professions.struct';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProfessionDto } from './dto/create-profession.dto';

@Injectable()
export class ProfessionsService {
    constructor(@InjectModel(Profession) private professionsDB: typeof Profession) {}

    async createProfession(createProfessionDto: CreateProfessionDto): Promise<Profession> {
        log('createProfession');

        if (await this.checkExistenceName(createProfessionDto.name)) {
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

    // TODO : контролировать каскадное удаление filmMembers по профессии
    async deleteProfession(id: number): Promise<number> {
        log('deleteProfession');

        const profession = await this.getProfessionById(id);
        if (!profession) {
            throw new NotFoundException({ message: 'Profession not found' });
        }

        return this.professionsDB.destroy({ where: { id } });
    }

    private async checkExistenceName(name: string) {
        log('checkExistenceName');

        const count = await this.professionsDB.count({
            where: { name },
        });

        return count > 0 ? true : false;
    }
}
