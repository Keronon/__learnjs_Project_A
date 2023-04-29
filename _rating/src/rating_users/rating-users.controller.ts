
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > C-Rating_users :`, data, colors.reset );

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RatingUsersService } from './rating-users.service';
import { RatingUser } from './rating-users.struct';
import { CreateRatingUserDto as SetRatingUserDto } from './dto/create-rating-user.dto';
import { UidGuard } from 'src/_decorators/guards/uid.guard';
import { Roles } from 'src/_decorators/roles-auth.decorator';

@ApiTags('Пользовательские оценки фильмов')
@Controller('api/rating-users')
export class RatingUsersController {
    constructor(private ratingUsersService: RatingUsersService) {}

    @ApiOperation({ summary: 'Получение оценки по id фильма и пользователя' })
    @ApiParam({ required: true, name: 'idFilm', description: 'id фильма', example: 1 })
    @ApiParam({ required: true, name: 'idUser', description: 'id пользователя', example: 1 })
    @ApiResponse({ status: 200, type: RatingUser })
    @UseGuards(UidGuard)
    @Roles('ME', 'ADMIN')
    @Get('/film/:idFilm/user/:idUser')
    getRatingUserByFilmIdAndUserId(@Param() param: { idFilm: number; idUser: number }): Promise<RatingUser> {
        log('getRatingUserByFilmIdAndUserId');
        return this.ratingUsersService.getRatingUserByFilmIdAndUserId(param.idFilm, param.idUser);
    }

    @ApiOperation({ summary: 'Создание/обновление пользовательской оценки фильма' })
    @ApiBody({
        required: true,
        type: SetRatingUserDto,
        description: 'Объект с данными для создания/обновления пользовательской оценки фильма',
    })
    @ApiResponse({ status: 200, type: RatingUser })
    @UseGuards(UidGuard)
    @Roles('ME', 'ADMIN')
    @Post()
    setRatingUser(@Body() setRatingUserDto: SetRatingUserDto): Promise<RatingUser> {
        log('setRatingUser');
        return this.ratingUsersService.setRatingUser(setRatingUserDto);
    }
}
