
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > S-Users :`, data, colors.reset );

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from './../roles/roles.service';
import { User } from './users.struct';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueueNames, RMQ } from 'src/rabbit.core';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private usersDB: typeof User,
                private rolesService: RolesService
    ) {
        RMQ.connect().then(RMQ.setCmdConsumer(this, QueueNames.PU_cmd, QueueNames.PU_data));
    }

    async createUser(dto: CreateUserDto): Promise<User> {
        log('createUser');

        const user = await this.usersDB.create(dto);
        const role = await this.rolesService.getRoleByValue(dto.role);

        if (!(role && user)) {
            throw new NotFoundException({ message: 'User or role not found' });
        }

        await user.$set('role', role.id);
        user.role = role;

        return user;
    }

    async getAllUsers(): Promise<User[]> {
        log('getAllUsers');

        return await this.usersDB.findAll({
            include: { all: true },
        });
    }

    async getUserById(id: number): Promise<User> {
        log('getUserById');

        return await this.usersDB.findOne({
            where: { id },
            include: { all: true },
        });
    }

    async getUserByEmail(email: string): Promise<User> {
        log('getUserByEmail');

        return await this.usersDB.findOne({
            where: { email },
            include: { all: true },
        });
    }

    async updateUser(updateUserDto: UpdateUserDto): Promise<User> {
        log('updateUser');

        const user = await this.getUserById(updateUserDto.id);
        if (!user) {
            throw new NotFoundException({ message: 'User not found' });
        }

        const userWithSameEmail = await this.getUserByEmail(updateUserDto.email);
        if (userWithSameEmail && userWithSameEmail.id !== user.id) {
            throw new ConflictException({ message: 'User with this email already exists' });
        }

        user.email = updateUserDto.email;
        await user.save();

        return user;
    }

    async deleteUserById(id: number): Promise<number> {
        log('deleteUserById');

        const user = await this.getUserById(id);
        if (!user) {
            throw new NotFoundException({ message: 'User not found' });
        }

        return await this.usersDB.destroy({ where: { id } });
    }
}
