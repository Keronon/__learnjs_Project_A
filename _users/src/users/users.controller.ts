
import { colors } from './../console.colors';
const log = (data: any) => console.log(colors.fg.yellow, `- - > C-Users :`, data, colors.reset);

import { ApiBearerAuth,
         ApiForbiddenResponse,
         ApiOkResponse,
         ApiOperation,
         ApiParam,
         ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.struct';
import { RolesGuard } from '../_decorators/guards/roles.guard';
import { Roles } from '../_decorators/roles-auth.decorator';

@ApiTags('Пользователи')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary: 'Получение массива всех пользователей (ADMIN)' })
    @ApiOkResponse({ type: [User], description: 'Успех. Ответ - массив пользователей' })
    @ApiForbiddenResponse({
        schema: { example: { message: 'No access' } },
        description: 'Неавторизованный пользователь / доступ запрещён. Ответ - Error: Forbidden',
    })
    @Roles('ADMIN')
    @Get()
    getAllUsers(): Promise<User[]> {
        log('getAllUsers');
        return this.usersService.getAllUsers();
    }

    @ApiOperation({ summary: 'Получение пользователя по его id (ADMIN)' })
    @ApiParam({ name: 'id', description: 'id пользователя', example: 1 })
    @ApiOkResponse({ type: User, description: 'Успех. Ответ - пользователь / ничего(не найден)' })
    @ApiForbiddenResponse({
        schema: { example: { message: 'No access' } },
        description: 'Неавторизованный пользователь / доступ запрещён. Ответ - Error: Forbidden',
    })
    @Roles('ADMIN')
    @Get(':id')
    getUserById(@Param('id') id: number): Promise<User> {
        log('getUserById');
        return this.usersService.getUserById(id);
    }
}
