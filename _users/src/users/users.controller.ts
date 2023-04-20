
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > C-Users :`, data, colors.reset );

import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import { AddRoleDto } from './dto/add-role.dto';
import { JwtAuthGuard } from '../_decorators/guards/jwt-auth.guard';
import { RolesGuard } from '../_decorators/guards/roles.guard';
import { Roles } from '../_decorators/roles-auth.decorator';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary: 'Получение массива всех пользователей' })
    @ApiResponse({ status: 200, type: Array<User>, isArray: true })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get()
    getAllUsers(): Promise<User[]> {
        log('getAllUsers');
        return this.usersService.getAllUsers();
    }

    @ApiOperation({ summary: 'Получение пользователя по его id' })
    @ApiParam({ required: true, name: 'id', description: 'id пользователя', example: 1 })
    @ApiResponse({ status: 200, type: User })
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getUserById(@Param('id') id: number): Promise<User> {
        log('getUserById');
        return this.usersService.getUserById(id);
    }

    @ApiOperation({ summary: 'Установка роли пользователю' })
    @ApiBody({ required: true, type: AddRoleDto, description: 'Объект с данными для установки роли' })
    @ApiResponse({ status: 200, type: User })
    @UseGuards(JwtAuthGuard)
    @Post('/role')
    setRole(@Body() addRoleDto: AddRoleDto): Promise<User> {
        log('addRole');
        return this.usersService.setRole(addRoleDto);
    }
}
