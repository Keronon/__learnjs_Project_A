
import { Delete, Param } from '@nestjs/common';
import { Body, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiParam } from '@nestjs/swagger';
import { Roles } from './../_decorators/roles-auth.decorator';
import { RolesGuard } from './../_decorators/guards/roles.guard';
import { GenresService } from './genres.service';
import { Genre } from './genres.struct';
import { CreateGenreDto } from './dto/create-genre.dto';

@ApiTags('Жанры фильмов')
@Controller('api/genres')
export class GenresController {
    constructor(private genresService: GenresService) {}

    @ApiOperation({ summary: 'Получение массива всех жанров фильмов' })
    @ApiResponse({ status: 200, type: [Genre] })
    @Get()
    getAllCountries(): Promise<Genre[]> {
        return this.genresService.getAllGenres();
    }

    @ApiOperation({ summary: 'Создание жанра фильма (ADMIN)' })
    @ApiBody({ required: true, type: CreateGenreDto, description: 'Объект с данными для создания жанра фильма' })
    @ApiResponse({ status: 200, type: Genre })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    createCountry(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
        return this.genresService.createGenre(createGenreDto);
    }

    @ApiOperation({ summary: 'Удаление жанра фильма (ADMIN)' })
    @ApiParam({ required: true, name: 'id', description: 'id жанра фильма', example: 1 })
    @ApiResponse({ status: 200, type: Number, description: "количество удалённых строк" })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete(':id')
    deleteCountryById(@Param('id') id: number): Promise<number> {
        return this.genresService.deleteGenreById(id);
    }
}
