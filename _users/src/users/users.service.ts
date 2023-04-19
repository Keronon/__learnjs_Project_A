import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from './../roles/roles.service';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { AddRoleDto } from './dto/add-role.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private rolesService: RolesService,
    ) {}

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.findAll({
            include: { all: true },
        });
    }

    async getUserById(id: number): Promise<User> {
        return await this.userRepository.findOne({
            where: { id },
            include: { all: true },
        });
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { email },
            include: { all: true },
        });
        return user;
    }

    async createUser(dto: CreateUserDto): Promise<User> {
        const user = await this.userRepository.create(dto);

        // set role
        const role = await this.rolesService.getRoleByValue('USER');
        await user.$set('role', role.id);
        user.role = role;

        return user;
    }

    async addRole(addRoleDto: AddRoleDto): Promise<User> {
        const user = await this.getUserById(addRoleDto.id_user);
        const role = await this.rolesService.getRoleByValue(addRoleDto.role_name);

        if (!(role && user)) {
            throw new NotFoundException({ message: 'User or role not found' });
        }

        await user.$add('role', role.id);
        return await this.getUserById(addRoleDto.id_user);
    }

    async deleteUserById(id: number): Promise<void> {
        await this.userRepository.destroy({ where: { id } });
    }
}
