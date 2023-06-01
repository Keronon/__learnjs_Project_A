
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > S-Roles :`, data, colors.reset );

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.struct';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private rolesDB: typeof Role) {}

    async getAllRoles(): Promise<Role[]> {
        log('getAllRoles');
        return await this.rolesDB.findAll();
    }

    async getRoleByValue(name: string): Promise<Role> {
        log('getRoleByValue');
        return await this.rolesDB.findOne({ where: { name } });
    }
}
