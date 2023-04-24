
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.yellow, `- - > C-Rating_films :`, data, colors.reset);

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RatingFilmsService } from './rating-films.service';
import { RatingUsersSelfGuard } from './../_decorators/guards/self.guard';

@ApiTags('Оценки фильмов')
@Controller('api/rating-films')
export class RatingFilmsController {
    constructor(private ratingFilmsService: RatingFilmsService) {}

    @ApiOperation({ summary: 'Получение количества пользовательских оценок по id фильма' })
    @ApiParam({ required: true, name: 'idFilm', description: 'id фильма', example: 1 })
    @ApiResponse({ status: 200, type: Number })
    @UseGuards(RatingUsersSelfGuard)
    @Get(':idFilm')
    getRatingFilmCountByFilmId(@Param() idFilm: number): Promise<number> {
        log('getRatingFilmCountByFilmId');
        return this.ratingFilmsService.getRatingFilmCountByFilmId(idFilm);
    }
}
