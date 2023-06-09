
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
         ApiOkResponse,
         ApiConsumes } from '@nestjs/swagger';
import { Get, HttpCode } from '@nestjs/common';
import { FilmsService } from './films.service';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './films.struct';
import { Roles } from '../_decorators/roles-auth.decorator';
import { RolesGuard } from '../_decorators/guards/roles.guard';
import { CreateFilmDto } from './dto/create-film.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upload.dto';
import { GetMemberFilmDto } from './dto/get-member-film.dto';
import { FilmFiltersDto } from './dto/film-filters.dto';

@ApiTags('Фильмы')
@Controller('api/films')
export class FilmsController {
    constructor(private filmsService: FilmsService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN) Создание фильма' })
    @ApiBody({ type: CreateFilmDto, description: 'Объект с данными нового фильма' })
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
    @Post()
    createFilm(@Body() dto: CreateFilmDto): Promise<Film> {
        log('createFilm');
        return this.filmsService.createFilm(dto);
    }

    @ApiOperation({ summary: 'Получение фильма по id' })
    @ApiParam({ name: 'id', description: 'id фильма', example: 1 })
    @ApiOkResponse({ type: Film, description: 'Успех. Ответ - фильм / ничего(не найден)' })
    @Get(':id')
    getFilmById(@Param('id') id: number): Promise<Film> {
        log('getFilmById');
        return this.filmsService.getFilmById(id);
    }

    @ApiOperation({ summary: 'Получение массива всех фильмов' })
    @ApiParam({ name: 'part', description: 'номер партии данных (начало c 1)', example: 1 })
    @ApiOkResponse({ type: [Film], description: 'Успех. Ответ - массив фильмов' })
    @Get('part/:part')
    getAllFilms(@Param('part') part: number): Promise<Film[]> {
        log('getAllFilms');
        return this.filmsService.getAllFilms(part);
    }

    @ApiOperation({ summary: 'Получение массива всех фильмов работника киноиндустрии' })
    @ApiParam({ name: 'idMember', description: 'id работника киноиндустрии', example: 1 })
    @ApiOkResponse({ type: [GetMemberFilmDto], description: 'Успех. Ответ - массив фильмов' })
    @Get('member/:idMember')
    getMemberFilms(@Param('idMember') idMember: number): Promise<GetMemberFilmDto[]> {
        log('getMemberFilms');
        return this.filmsService.getMemberFilms(idMember);
    }

    @ApiOperation({ summary: 'Получение массива отфильтрованных фильмов' })
    @ApiBody({ type: FilmFiltersDto, description: 'Объект с данными для фильтрации' })
    @ApiOkResponse({ type: [Film], description: 'Успех. Ответ - массив фильмов' })
    @ApiBadRequestResponse({
        schema: {
            example: [
                'ratingStart - Must be less than 10',
                'countRatingStart - Must be a number',
                'arrMembersFilterDto - Must be at least one member filter',
                'part - Must be more than 1'
            ],
        },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
    })
    @Post('/filter')
    @HttpCode(200)
    getFilteredFilms(@Body() filmFiltersDto: FilmFiltersDto): Promise<Film[]> {
        log('getFilteredFilms');
        return this.filmsService.getFilteredFilms(filmFiltersDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN) Изменение информации о фильме' })
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
    @Put()
    updateFilm(@Body() updateFilmDto: UpdateFilmDto): Promise<Film> {
        log('updateFilm');
        return this.filmsService.updateFilm(updateFilmDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN) Изменение изображения фильма' })
    @ApiParam({ name: 'id', description: 'id фильма', example: 1 })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: FileUploadDto, description: 'Новое изображения фильма' })
    @ApiOkResponse({ type: Film, description: 'Успех. Ответ - изменённый фильм' })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Film not found' } },
        description: 'Фильм не найден. Ответ - Error: Not Found',
    })
    @ApiBadRequestResponse({
        schema: { example: { message: 'Image is empty' } },
        description: 'Файл с изображением фильма не прикреплён. Ответ - Error: Bad Request',
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
    @UseInterceptors(FileInterceptor('image'))
    @Put(':id')
    updateImage(@Param('id') id: number, @UploadedFile() image): Promise<Film> {
        log('updateImage');
        return this.filmsService.updateImageById(id, image);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN) Удаление фильма' })
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
