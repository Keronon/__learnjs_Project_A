
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.yellow, `- - > C-Rating_films :`, data, colors.reset);

import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RatingFilmsService } from './rating-films.service';

@ApiTags('Рейтинг фильмов')
@Controller('api/rating-films')
export class RatingFilmsController {
    constructor(private ratingFilmsService: RatingFilmsService) {}

    @ApiOperation({ summary: 'Получение количества пользовательских оценок по id фильма' })
    @ApiParam({ name: 'idFilm', description: 'id фильма', example: 1 })
    @ApiOkResponse({ type: Number, description: 'Успех. Ответ - количество пользовательских оценок' })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Rating film not found' } },
        description: 'Рейтинг по фильму не найден. Ответ - Error: Not Found',
    })
    @Get(':idFilm')
    getRatingFilmCountByFilmId(@Param('idFilm') idFilm: number ): Promise<number> {
        log('getRatingFilmCountByFilmId');
        return this.ratingFilmsService.getRatingFilmCountByFilmId(idFilm);
    }
}
