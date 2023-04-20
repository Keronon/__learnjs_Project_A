
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { FilmInfoService } from './film-info.service';
import { FilmInfo } from './film-info.model';
import { UpdateFilmInfoDto } from './dto/update-film-info.dto';

@ApiTags('Дополнительная информация о фильме')
@Controller('film-info')
export class FilmInfoController {
    constructor(private filmInfoService: FilmInfoService) {}

    @ApiOperation({ summary: 'Получение доп. информации о фильме по id фильма' })
    @ApiParam({ name: 'id', description: 'id фильма', example: 1 })
    @ApiResponse({ status: 200, type: FilmInfo })
    @Get('film/:id')
    getFilmInfoByFilmId(@Param('id') idFilm: number): Promise<FilmInfo> {
        return this.filmInfoService.getFilmInfoByFilmId(idFilm);
    }

    @ApiOperation({ summary: 'Изменение доп. информации о фильме' })
    @ApiResponse({ status: 200, type: FilmInfo })
    @Put()
    updateProfile(@Body() updateFilmInfoDto: UpdateFilmInfoDto): Promise<FilmInfo> {
        return this.filmInfoService.updateFilmInfo(updateFilmInfoDto);
    }
}
