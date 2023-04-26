
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > C-Rating_users :`, data, colors.reset );

import { Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RatingUsersService } from './rating-users.service';
import { RatingUser } from './rating-users.struct';
import { CreateRatingUserDto } from './dto/create-rating-user.dto';
import { RatingUsersSelfGuard } from 'src/_decorators/guards/self.guard';

@ApiTags('Пользовательские оценки фильмов')
@Controller('api/rating-users')
export class RatingUsersController {
    constructor(private ratingUsersService: RatingUsersService) {}

    @ApiOperation({ summary: 'Получение оценки по id фильма и пользователя' })
    @ApiParam({ required: true, name: 'idFilm', description: 'id фильма', example: 1 })
    @ApiParam({ required: true, name: 'idUser', description: 'id пользователя', example: 1 })
    @ApiResponse({ status: 200, type: RatingUser })
    @UseGuards(RatingUsersSelfGuard)
    @Get('/film/:idFilm/user/:idUser')
    getRatingUserByFilmIdAndUserId(@Param() param: { idFilm: number; idUser: number }): Promise<RatingUser> {
        log('getRatingUserByFilmIdAndUserId');
        return this.ratingUsersService.getRatingUserByFilmIdAndUserId(param.idFilm, param.idUser);
    }

    @ApiOperation({ summary: 'Создание/обновление пользовательской оценки фильма' })
    @ApiBody({
        required: true,
        type: CreateRatingUserDto,
        description: 'Объект с данными для создания/обновления пользовательской оценки фильма',
    })
    @ApiResponse({ status: 200, type: RatingUser })
    @Post()
    сreateRatingUser(@Headers('Authorization') authHeader, @Body() createRatingUserDto: CreateRatingUserDto): Promise<RatingUser> {
        log('createRatingUser');
        return this.ratingUsersService.сreateRatingUser(authHeader, createRatingUserDto);
    }
}
