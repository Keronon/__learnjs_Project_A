import { Delete, Param } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilmsService } from './films.service';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './films.struct';
import { Roles } from './../_decorators/roles-auth.decorator';
import { RolesGuard } from './../_decorators/guards/roles.guard';
import { CreateFilmDto } from './dto/create-film.dto';

@ApiTags('Фильмы')
@Controller('api/films')
export class FilmsController {
    constructor(private filmsService: FilmsService) {}

    @ApiOperation({ summary: 'Создание фильма (ADMIN)' })
    @ApiBody({ required: true, type: CreateFilmDto, description: 'Объект с данными для создания фильма' })
    @ApiResponse({ status: 200, type: Film })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    createCountry(@Body() createFilmDto: CreateFilmDto): Promise<Film> {
        return this.filmsService.createFilm(createFilmDto);
    }

    @ApiOperation({ summary: 'Изменение информации о фильме (ADMIN)' })
    @ApiBody({ required: true, type: UpdateFilmDto, description: 'Объект с изменёнными полями информации о фильме' })
    @ApiResponse({ status: 200, type: Film })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Put()
    updateFilm(@Body() updateFilmDto: UpdateFilmDto): Promise<Film> {
        return this.filmsService.updateFilm(updateFilmDto);
    }

    @ApiOperation({ summary: 'Удаление фильма (ADMIN)' })
    @ApiParam({ required: true, name: 'id', description: 'id фильма', example: 1 })
    @ApiResponse({ status: 200, type: Number, description: "количество удалённых строк" })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete(':id')
    deleteCountryById(@Param('id') id: number): Promise<number> {
        return this.filmsService.deleteFilmById(id);
    }
}
