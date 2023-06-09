
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.yellow, `- - > C-Users :`, data, colors.reset);

import { ApiBearerAuth,
         ApiForbiddenResponse,
         ApiOkResponse,
         ApiOperation,
         ApiParam,
         ApiTags,
         ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.struct';
import { RolesGuard } from '../_decorators/guards/roles.guard';
import { Roles } from '../_decorators/roles-auth.decorator';
import { GetUserDto } from './dto/get-user.dto';

@ApiBearerAuth()
@ApiTags('Пользователи')
@UseGuards(RolesGuard)
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary: '(ADMIN) Получение массива всех пользователей' })
    @ApiOkResponse({ type: [GetUserDto], description: 'Успех. Ответ - массив пользователей' })
    @ApiUnauthorizedResponse({
        schema: { example: { message: 'User unauthorized' } },
        description: 'Неавторизованный пользователь. Ответ - Error: Unauthorized',
    })
    @ApiForbiddenResponse({
        schema: {
            example: {
                statusCode: 403,
                message: 'Forbidden resource',
                error: 'Forbidden',
            },
        },
        description: 'Доступ запрещён. Ответ - Error: Forbidden',
    })
    @Roles('ADMIN')
    @Get()
    getAllUsers(): Promise<User[]> {
        log('getAllUsers');
        return this.usersService.getAllUsers();
    }

    @ApiOperation({ summary: '(ADMIN) Получение пользователя по его id' })
    @ApiParam({ name: 'id', description: 'id пользователя', example: 1 })
    @ApiOkResponse({ type: GetUserDto, description: 'Успех. Ответ - пользователь / ничего(не найден)' })
    @ApiUnauthorizedResponse({
        schema: { example: { message: 'User unauthorized' } },
        description: 'Неавторизованный пользователь. Ответ - Error: Unauthorized',
    })
    @ApiForbiddenResponse({
        schema: {
            example: {
                statusCode: 403,
                message: 'Forbidden resource',
                error: 'Forbidden',
            },
        },
        description: 'Доступ запрещён. Ответ - Error: Forbidden',
    })
    @Roles('ADMIN')
    @Get(':id')
    getUserById(@Param('id') id: number): Promise<User> {
        log('getUserById');
        return this.usersService.getUserById(id);
    }
}
