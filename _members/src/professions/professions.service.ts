
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > S-Professions :`, data, colors.reset );

import { Injectable } from '@nestjs/common';
import { Profession } from './professions.struct';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ProfessionsService {
    constructor(@InjectModel(Profession) private professionsDB: typeof Profession,
    ) {}

    async createProfession ( name: string ): Promise<Profession>
    {
        log('createProfession');
        return await this.professionsDB.create({name: name});
    }

    async getAllProfessions (): Promise<Profession[]>
    {
        log('getAllProfessions');
        return await this.professionsDB.findAll();
    }

    async deleteProfession ( name: string ): Promise<number>
    {
        log('deleteProfession');
        return this.professionsDB.destroy({ where: { name } });
    }
}
