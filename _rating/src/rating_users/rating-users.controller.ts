
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.yellow, `- - > C-Rating_users :`, data, colors.reset);

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse,
         ApiBearerAuth,
         ApiBody,
         ApiCreatedResponse,
         ApiForbiddenResponse,
         ApiNotFoundResponse,
         ApiOkResponse,
         ApiOperation,
         ApiParam,
         ApiTags,
         ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RatingUsersService } from './rating-users.service';
import { RatingUser } from './rating-users.struct';
import { SetRatingUserDto } from './dto/set-rating-user.dto';
import { UidGuard } from '../_decorators/guards/uid.guard';
import { Roles } from '../_decorators/roles-auth.decorator';
import { JwtAuthGuard } from '../_decorators/guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('Пользовательские оценки фильмов')
@Controller('api/rating-users')
export class RatingUsersController {
    constructor(private ratingUsersService: RatingUsersService) {}

    @ApiOperation({ summary: 'Получение оценки по id фильма и пользователя' })
    @ApiParam({ name: 'idFilm', description: 'id фильма', example: 1 })
    @ApiParam({ name: 'idUser', description: 'id пользователя', example: 1 })
    @ApiOkResponse({
        type: RatingUser,
        description: 'Успех. Ответ - оценка пользователя / ничего(не найден)',
    })
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
    @UseGuards(UidGuard)
    @Roles('ME', 'ADMIN')
    @UseGuards(JwtAuthGuard)
    @Get('/film/:idFilm/user/:idUser')
    getRatingUserByFilmIdAndUserId(@Param() param: { idFilm: number; idUser: number }): Promise<RatingUser> {
        log('getRatingUserByFilmIdAndUserId');
        return this.ratingUsersService.getRatingUserByFilmIdAndUserId(param.idFilm, param.idUser);
    }

    @ApiOperation({ summary: 'Создание/обновление пользовательской оценки фильма' })
    @ApiBody({
        type: SetRatingUserDto,
        description: 'Объект с данными для создания/обновления пользовательской оценки фильма',
    })
    @ApiCreatedResponse({ type: RatingUser, description: 'Успех. Ответ - оценка пользователя' })
    @ApiBadRequestResponse({
        schema: { example: ['rating - Must be less than 10', 'idFilm - Must be a number'] },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
    })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Rating film not found' } },
        description: 'Рейтинг фильма не найден (некорректный idFilm). Ответ - Error: Not Found',
    })
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
    @UseGuards(UidGuard)
    @Roles('ME')
    @UseGuards(JwtAuthGuard)
    @Post()
    setRatingUser(@Body() setRatingUserDto: SetRatingUserDto): Promise<RatingUser> {
        log('setRatingUser');
        return this.ratingUsersService.setRatingUser(setRatingUserDto);
    }
}
