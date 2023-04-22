
import { Injectable } from '@nestjs/common';
import { Profession } from './professions.struct';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ProfessionsService {
    constructor(@InjectModel(Profession) private professionsDB: typeof Profession,
    ) {}

    async createProfession ( name: string ): Promise<Profession>
    {
        return await this.professionsDB.create({name: name});
    }

    async getAllProfessions (): Promise<Profession[]>
    {
        return await this.professionsDB.findAll();
    }

    async deleteProfession ( name: string ): Promise<number>
    {
        return this.professionsDB.destroy({ where: { name } });
    }
}
