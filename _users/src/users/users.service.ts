import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { AddRoleDto } from './dto/add-role.dto';
import { RolesService } from './../roles/roles.service';

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

        // Назначение роли пользователю
        const role = await this.rolesService.getRoleByValue('USER');
        await user.$set('role', role.id);
        user.role = role;

        return user;
    }

    async addRole(addRoleDto: AddRoleDto): Promise<User> {
        const user = await this.getUserById(addRoleDto.userId);
        const role = await this.rolesService.getRoleByValue(addRoleDto.value);

        if (!(role && user)) {
            throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
        }

        await user.$add('role', role.id);
        return await this.getUserById(addRoleDto.userId);
    }

    async deleteUserById(id: number): Promise<void> {
        await this.userRepository.destroy({ where: { id } });
    }
}
