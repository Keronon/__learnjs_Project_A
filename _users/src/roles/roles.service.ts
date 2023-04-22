
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.struct';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private rolesDB: typeof Role) {}

    async getAllRoles(): Promise<Role[]> {
        return await this.rolesDB.findAll();
    }

    async getRoleByValue(name: string): Promise<Role> {
        return await this.rolesDB.findOne({ where: { name } });
    }
}
