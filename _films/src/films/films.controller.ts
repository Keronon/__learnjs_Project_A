
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > C-Films :`, data, colors.reset );

import { Delete, Param, Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { ApiParam, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
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

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Создание фильма' })
    @ApiBody({ required: true, type: CreateFilmDto, description: 'Объект с данными для создания фильма' })
    @ApiResponse({ status: 200, type: Film })
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Post()
    createFilm(@Body() createFilmDto: CreateFilmDto): Promise<Film> {
        log('createFilm');
        return this.filmsService.createFilm(createFilmDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Изменение информации о фильме' })
    @ApiBody({ required: true, type: UpdateFilmDto, description: 'Объект с изменёнными полями информации о фильме' })
    @ApiResponse({ status: 200, type: Film })
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Put()
    updateFilm(@Body() updateFilmDto: UpdateFilmDto): Promise<Film> {
        log('updateFilm');
        return this.filmsService.updateFilm(updateFilmDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Удаление фильма' })
    @ApiParam({ required: true, name: 'id', description: 'id фильма', example: 1 })
    @ApiResponse({ status: 200, type: Number, description: "количество удалённых строк" })
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    deleteFilmById(@Param('id') id: number): Promise<number> {
        log('deleteFilmById');
        return this.filmsService.deleteFilmById(id);
    }
}
