
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > C-Film_members :`, data, colors.reset );

import { ApiResponse, ApiOperation, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { Controller, Param, Post, Delete, UseGuards, Body, Get } from '@nestjs/common';
import { FilmMembersService } from './film_members.service';
import { Roles } from '../_decorators/roles-auth.decorator';
import { RolesGuard } from '../_decorators/guards/roles.guard';
import { CreateFilmMemberDto } from './dto/create-film-member.dto';
import { FilmMember } from './film_members.struct';
import { GetMembersByIdFilmDto } from './dto/get-members-by-idFilm.dto';
import { JwtAuthGuard } from 'src/_decorators/guards/jwt-auth.guard';

@ApiTags('Участники фильмов')
@Controller('api/film-members')
export class FilmMembersController {
    constructor(private filmMembersService: FilmMembersService) {}

    @ApiOperation({ summary: 'Добавление нового участника фильма' })
    @ApiBody({ type: CreateFilmMemberDto, description: 'Объект с данными о участнике фильма' })
    @ApiResponse({ status: 200, type: FilmMember })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    createFilmMember(@Body() createFilmMemberDto: CreateFilmMemberDto): Promise<FilmMember> {
        log('createFilmMember');
        return this.filmMembersService.createFilmMember(createFilmMemberDto);
    }

    @ApiOperation({ summary: 'Получение всех участников конкретного фильма' })
    @ApiParam({ name: 'idFilm', description: 'id фильма', example: 1 })
    @ApiResponse({ status: 200, type: [GetMembersByIdFilmDto] })
    @UseGuards(JwtAuthGuard)
    @Get(':idFilm')
    getMembersByIdFilm(@Param('idFilm') idFilm: number): Promise<GetMembersByIdFilmDto[]> {
        log('getMembersByIdFilm');
        return this.filmMembersService.getMembersByIdFilm(idFilm);
    }

    @ApiOperation({ summary: 'Удаление участника фильма' })
    @ApiParam({ name: 'id', description: 'id участника фильма', example: 1 })
    @ApiResponse({ status: 200, type: Number, description: "количество удалённых строк" })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete(':id')
    deleteFilmMember(@Param('id') id: number): Promise<number> {
        log('deleteFilmMember');
        return this.filmMembersService.deleteFilmMember(id);
    }
}
