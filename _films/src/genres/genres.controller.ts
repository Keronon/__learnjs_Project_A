
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > C-Genres :`, data, colors.reset );

import { Delete, Param } from '@nestjs/common';
import { Body, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiParam } from '@nestjs/swagger';
import { Roles } from './../_decorators/roles-auth.decorator';
import { RolesGuard } from './../_decorators/guards/roles.guard';
import { JwtAuthGuard } from 'src/_decorators/guards/jwt-auth.guard';
import { GenresService } from './genres.service';
import { Genre } from './genres.struct';
import { CreateGenreDto } from './dto/create-genre.dto';

@ApiTags('Жанры фильмов')
@Controller('api/genres')
export class GenresController {
    constructor(private genresService: GenresService) {}

    @ApiOperation({ summary: 'Создание жанра фильма' })
    @ApiBody({ required: true, type: CreateGenreDto, description: 'Объект с данными для создания жанра фильма' })
    @ApiResponse({ status: 200, type: Genre })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    createGenre(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
        log('createGenre');
        return this.genresService.createGenre(createGenreDto);
    }

    @ApiOperation({ summary: 'Получение массива всех жанров фильмов' })
    @ApiResponse({ status: 200, type: [Genre] })
    @UseGuards(JwtAuthGuard)
    @Get()
    getAllGenres(): Promise<Genre[]> {
        log('getAllGenres');
        return this.genresService.getAllGenres();
    }

    @ApiOperation({ summary: 'Удаление жанра фильма' })
    @ApiParam({ required: true, name: 'id', description: 'id жанра фильма', example: 1 })
    @ApiResponse({ status: 200, type: Number, description: "количество удалённых строк" })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete(':id')
    deleteGenreById(@Param('id') id: number): Promise<number> {
        log('deleteGenreById');
        return this.genresService.deleteGenreById(id);
    }
}
