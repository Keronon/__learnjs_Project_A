
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > C-Users :`, data, colors.reset );

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import { AddRoleDto } from './dto/add-role.dto';
import { JwtAuthGuard } from '../_decorators/guards/jwt-auth.guard';
import { RolesGuard } from '../_decorators/guards/roles.guard';
import { Roles } from '../_decorators/roles-auth.decorator';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get()
    getAllUsers(): Promise<User[]> {
        log('getAllUsers');
        return this.usersService.getAllUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getUserById(@Param('id') id: number): Promise<User> {
        log('getUserById');
        return this.usersService.getUserById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/role')
    addRole(@Body() addRoleDto: AddRoleDto): Promise<User> {
        log('addRole');
        return this.usersService.addRole(addRoleDto);
    }
}
