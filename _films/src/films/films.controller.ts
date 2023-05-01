
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.yellow, `- - > C-Films :`, data, colors.reset);

import { Delete, Param, Body, Controller, Post, Put, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiParam,
         ApiBody,
         ApiOperation,
         ApiTags,
         ApiBearerAuth,
         ApiCreatedResponse,
         ApiBadRequestResponse,
         ApiConflictResponse,
         ApiForbiddenResponse,
         ApiNotFoundResponse,
         ApiUnauthorizedResponse,
         ApiOkResponse } from '@nestjs/swagger';
import { FilmsService } from './films.service';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './films.struct';
import { Roles } from '../_decorators/roles-auth.decorator';
import { RolesGuard } from '../_decorators/guards/roles.guard';
import { CreateFilmDto } from './dto/create-film.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Фильмы')
@Controller('api/films')
export class FilmsController {
    constructor(private filmsService: FilmsService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Создание фильма (ADMIN)' })
    @ApiBody({ type: CreateFilmDto, description: 'Объект с данными для нового фильма' })
    @ApiCreatedResponse({ type: Film, description: 'Успех. Ответ - созданный фильм' })
    @ApiBadRequestResponse({
        schema: {
            example: [
                'year - Must be a number',
                'ageRating - Must be a string',
                'arrIdGenres - Must be at least one genre',
            ],
        },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
    })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Country not found' } },
        description: 'Страна / жанр не найдены. Ответ - Error: Not Found',
    })
    @ApiConflictResponse({
        schema: { example: { message: 'Genre with id = 1 is repeated several times' } },
        description: 'Повтор в массиве жанров. Ответ - Error: Conflict',
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
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @UseInterceptors(FileInterceptor( 'image' ))
    @Post()
    createFilm(@Body() createFilmDto: CreateFilmDto, @UploadedFile() image): Promise<Film> {
        log('createFilm');
        return this.filmsService.createFilm(createFilmDto, image);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Изменение информации о фильме (ADMIN)' })
    @ApiBody({ type: UpdateFilmDto, description: 'Объект с изменёнными полями информации о фильме' })
    @ApiOkResponse({ type: Film, description: 'Успех. Ответ - изменённый фильм' })
    @ApiBadRequestResponse({
        schema: {
            example: [
                'year - Must be a number',
                'ageRating - Must be a string',
                'arrIdGenres - Must be at least one genre',
            ],
        },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
    })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Film not found' } },
        description: 'Фильм / страна / жанр не найдены. Ответ - Error: Not Found',
    })
    @ApiConflictResponse({
        schema: { example: { message: 'Genre with id = 1 is repeated several times' } },
        description: 'Повтор в массиве жанров. Ответ - Error: Conflict',
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
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @UseInterceptors(FileInterceptor( 'image' ))
    @Put()
    updateFilm(@Body() updateFilmDto: UpdateFilmDto, @UploadedFile() image): Promise<Film> {
        log('updateFilm');
        return this.filmsService.updateFilm(updateFilmDto, image);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Удаление фильма (ADMIN)' })
    @ApiParam({ required: true, name: 'id', description: 'id фильма', example: 1 })
    @ApiOkResponse({ type: Number, description: 'Успех. Ответ - количество удалённых строк' })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Film not found' } },
        description: 'Фильм не найден. Ответ - Error: Not Found',
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
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    deleteFilmById(@Param('id') id: number): Promise<number> {
        log('deleteFilmById');
        return this.filmsService.deleteFilmById(id);
    }
}
