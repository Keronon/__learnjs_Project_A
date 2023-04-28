
import { ApiBody,
         ApiParam,
         ApiOperation,
         ApiTags,
         ApiOkResponse,
         ApiNotFoundResponse,
         ApiBearerAuth,
         ApiBadRequestResponse,
         ApiForbiddenResponse,
         ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { FilmInfoService } from './film-info.service';
import { RolesGuard } from 'src/_decorators/guards/roles.guard';
import { Roles } from 'src/_decorators/roles-auth.decorator';
import { FilmInfo } from './film-info.struct';
import { UpdateFilmInfoDto } from './dto/update-film-info.dto';

@ApiTags('Дополнительная информация о фильме')
@Controller('api/film-info')
export class FilmInfoController {
    constructor(private filmInfoService: FilmInfoService) {}

    @ApiOperation({ summary: 'Получение доп. информации о фильме по id фильма' })
    @ApiParam({ name: 'id', description: 'id фильма', example: 1 })
    @ApiOkResponse({ type: FilmInfo, description: 'Успех. Ответ - доп. информации о фильме / ничего(не найдена)' })
    @Get('film/:id')
    getFilmInfoByFilmId(@Param('id') idFilm: number): Promise<FilmInfo> {
        return this.filmInfoService.getFilmInfoByFilmId(idFilm);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Изменение доп. информации о фильме (ADMIN)' })
    @ApiBody({ type: UpdateFilmInfoDto, description: 'Объект с изменёнными полями доп. информации о фильме' })
    @ApiOkResponse({ type: FilmInfo, description: 'Успех. Ответ - изменённая доп. информация о фильме' })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Film info not found' } },
        description: 'Доп. информация не найден. Ответ - Error: Not Found',
    })
    @ApiBadRequestResponse({
        schema: { example: ['text - Must be a string', 'trailerLink - Must be a string'] },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
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
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put()
    updateFilmInfo(@Body() updateFilmInfoDto: UpdateFilmInfoDto): Promise<FilmInfo> {
        return this.filmInfoService.updateFilmInfo(updateFilmInfoDto);
    }
}
