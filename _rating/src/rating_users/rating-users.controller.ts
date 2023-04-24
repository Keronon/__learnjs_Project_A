
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > C-Rating_users :`, data, colors.reset );

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RatingUsersService } from './rating-users.service';
import { RatingUser } from './rating-users.struct';
import { CreateRatingUserDto } from './dto/create-rating-user.dto';
import { JwtAuthGuard } from 'src/_decorators/guards/jwt-auth.guard';
import { RolesGuard } from 'src/_decorators/guards/roles.guard';
import { Roles } from 'src/_decorators/roles-auth.decorator';

@ApiTags('Пользовательские оценки фильмов')
@Controller('api/rating-users')
export class RatinUsersController {
    constructor(private ratingUsersService: RatingUsersService) {}

    @ApiOperation({ summary: 'Получение оценки по id фильма и пользователя' })
    @ApiParam({ required: true, name: 'idFilm', description: 'id фильма', example: 1 })
    @ApiParam({ required: true, name: 'idUser', description: 'id пользователя', example: 1 })
    @ApiResponse({ status: 200, type: RatingUser })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get('/film/:idFilm/user/:idUser')
    getRatingUserByFilmIdAndUserId(@Param() param: { idFilm: number; idUser: number }): Promise<RatingUser> {
        log('getRatingUserByFilmIdAndUserId');
        return this.ratingUsersService.getRatingUserByFilmIdAndUserId(param.idFilm, param.idUser);
    }

    // FIXME : RatingUsersSelfGuard будет блокировать создание оценок пользователями
    // - - - - он не подходит совсем
    // - - - - нужно иначе проверять принадлежность
    @ApiOperation({ summary: 'Создание/обновление пользовательской оценки фильма' })
    @ApiBody({
        required: true,
        type: CreateRatingUserDto,
        description: 'Объект с данными для создания/обновления пользовательской оценки фильма',
    })
    @ApiResponse({ status: 200, type: RatingUser })
    @UseGuards(JwtAuthGuard)
    @Post()
    сreateRatingUser(@Body() createRatingUserDto: CreateRatingUserDto): Promise<RatingUser> {
        log('createRatingUser');
        return this.ratingUsersService.сreateRatingUser(createRatingUserDto);
    }
}
