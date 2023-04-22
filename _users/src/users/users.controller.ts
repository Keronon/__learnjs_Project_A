
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > C-Users :`, data, colors.reset );

import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.struct';
import { JwtAuthGuard } from '../_decorators/guards/jwt-auth.guard';
import { RolesGuard } from '../_decorators/guards/roles.guard';
import { Roles } from '../_decorators/roles-auth.decorator';
import { DataType } from 'sequelize-typescript';

@ApiTags('Пользователи')
@Controller('api/users')
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
    @ApiParam({ required: true, name: 'id', description: 'id пользователя', example: 1 })
    @ApiBody({ required: true, schema: { description: 'Название роли', example: {roleName: "ADMIN"} }})
    @ApiResponse({ status: 200, type: User })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post('/:id/role')
    setRole(@Param('id') id: number, @Body() roleName: {roleName: string}): Promise<User> {
        log('addRole');
        return this.usersService.setRole(id, roleName);
    }
}
