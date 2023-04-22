
import { ApiBody, ApiParam, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { FilmInfoService } from './film-info.service';
import { JwtAuthGuard } from 'src/_decorators/guards/jwt-auth.guard';
import { RolesGuard } from 'src/_decorators/guards/roles.guard';
import { Roles } from 'src/_decorators/roles-auth.decorator';
import { FilmInfo } from './film-info.struct';
import { UpdateFilmInfoDto } from './dto/update-film-info.dto';

@ApiTags('Дополнительная информация о фильме')
@Controller('api/film-info')
export class FilmInfoController {
    constructor(private filmInfoService: FilmInfoService) {}

    @ApiOperation({ summary: 'Получение доп. информации о фильме по id фильма' })
    @ApiParam({ required: true, name: 'id', description: 'id фильма', example: 1 })
    @ApiResponse({ status: 200, type: FilmInfo })
    @UseGuards(JwtAuthGuard)
    @Get('film/:id')
    getFilmInfoByFilmId(@Param('id') idFilm: number): Promise<FilmInfo> {
        return this.filmInfoService.getFilmInfoByFilmId(idFilm);
    }

    @ApiOperation({ summary: 'Изменение доп. информации о фильме' })
    @ApiBody({ required: true, type: UpdateFilmInfoDto, description: 'Объект с изменёнными полями информации о фильме' })
    @ApiResponse({ status: 200, type: FilmInfo })
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put()
    updateFilmInfo(@Body() updateFilmInfoDto: UpdateFilmInfoDto): Promise<FilmInfo> {
        return this.filmInfoService.updateFilmInfo(updateFilmInfoDto);
    }
}
