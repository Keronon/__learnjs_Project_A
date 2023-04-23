import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RatingUsersService } from './rating-users.service';
import { RatingUser } from './rating-users.struct';
import { CreateRatingUserDto } from './dto/create-rating-user.dto';

@ApiTags('Пользовательские оценки фильмов')
@Controller('api/rating-users')
export class RatinUsersController {
    constructor(private ratingUsersService: RatingUsersService) {}

    @ApiOperation({ summary: 'Получение оценки по id фильма и пользователя (USER)' })
    @ApiParam({ required: true, name: 'idFilm', description: 'id фильма', example: 1 })
    @ApiParam({ required: true, name: 'idUser', description: 'id пользователя', example: 1 })
    @ApiResponse({ status: 200, type: RatingUser })
    @Get('/film/:idFilm/user/:idUser')
    getRatingUserByFilmIdAndUserId(@Param() param: { idFilm: number; idUser: number }): Promise<RatingUser> {
        return this.ratingUsersService.getRatingUserByFilmIdAndUserId(param.idFilm, param.idUser);
    }

    @ApiOperation({ summary: 'Создание/обновление пользовательской оценки фильма (USER)' })
    @ApiBody({
        required: true,
        type: CreateRatingUserDto,
        description: 'Объект с данными для создания/обновления пользовательской оценки фильма',
    })
    @ApiResponse({ status: 200, type: RatingUser })
    @Post()
    сreateRatingUser(@Body() createRatingUserDto: CreateRatingUserDto): Promise<RatingUser> {
        return this.ratingUsersService.сreateRatingUser(createRatingUserDto);
    }
}
