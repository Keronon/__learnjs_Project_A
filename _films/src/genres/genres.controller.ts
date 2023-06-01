
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.yellow, `- - > C-Genres :`, data, colors.reset);

import { Delete, Param, Put } from '@nestjs/common';
import { Body, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse,
         ApiBearerAuth,
         ApiBody,
         ApiConflictResponse,
         ApiCreatedResponse,
         ApiForbiddenResponse,
         ApiOkResponse,
         ApiOperation,
         ApiNotFoundResponse,
         ApiUnauthorizedResponse} from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiParam } from '@nestjs/swagger';
import { Roles } from '../_decorators/roles-auth.decorator';
import { RolesGuard } from '../_decorators/guards/roles.guard';
import { GenresService } from './genres.service';
import { Genre } from './genres.struct';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@ApiTags('Жанры фильмов')
@Controller('api/genres')
export class GenresController {
    constructor(private genresService: GenresService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN) Создание жанра фильма' })
    @ApiBody({ type: CreateGenreDto, description: 'Объект с данными для нового жанра фильма' })
    @ApiCreatedResponse({ type: Genre, description: 'Успех. Ответ - созданный жанр фильма' })
    @ApiBadRequestResponse({
        schema: { example: ['nameRU - Must be a string', 'nameEN - Must be a string'] },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
    })
    @ApiConflictResponse({
        schema: { example: { message: 'This genre name already exists' } },
        description: 'Жанр с данным названием уже существует. Ответ - Error: Conflict',
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
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    createGenre(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
        log('createGenre');
        return this.genresService.createGenre(createGenreDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN) Изменение информации о жанре' })
    @ApiBody({ type: UpdateGenreDto, description: 'Объект с изменёнными полями информации о жанре' })
    @ApiOkResponse({ type: Genre, description: 'Успех. Ответ - изменённый жанр' })
    @ApiBadRequestResponse({
        schema: { example: ['nameRU - Must be a string', 'nameEN - Must be a string'] },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
    })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Genre not found' } },
        description: 'Жанр не найден. Ответ - Error: Not Found',
    })
    @ApiConflictResponse({
        schema: { example: { message: 'This genre name already exists' } },
        description: 'Жанр с данным названием уже существует. Ответ - Error: Conflict',
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
    updateGenre(@Body() updateGenreDto: UpdateGenreDto): Promise<Genre> {
        log('updateGenre');
        return this.genresService.updateGenre(updateGenreDto);
    }

    @ApiOperation({ summary: 'Получение массива всех жанров фильмов' })
    @ApiOkResponse({ type: [Genre], description: 'Успех. Ответ - массив жанров фильмов' })
    @Get()
    getAllGenres(): Promise<Genre[]> {
        log('getAllGenres');
        return this.genresService.getAllGenres();
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN) Удаление жанра фильма' })
    @ApiParam({ name: 'id', description: 'id жанра фильма', example: 1 })
    @ApiOkResponse({ type: Number, description: 'Успех. Ответ - количество удалённых строк' })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Genre not found' } },
        description: 'Жанр фильма не найден. Ответ - Error: Not Found',
    })
    @ApiConflictResponse({
        schema: { example: { message: 'Can not delete genre (films refer to it)' } },
        description: 'Фильмы ссылаются на жанр. Ответ - Error: Conflict',
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
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete(':id')
    deleteGenreById(@Param('id') id: number): Promise<number> {
        log('deleteGenreById');
        return this.genresService.deleteGenreById(id);
    }
}
