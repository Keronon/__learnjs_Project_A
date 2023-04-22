
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > C-Profiles :`, data, colors.reset );

import { ApiResponse, ApiOperation, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { Controller, Get, Param, Post, Delete, UseGuards, Body } from '@nestjs/common';
import { FilmMembersService } from './film_members.service';
import { Roles } from 'src/_decorators/roles-auth.decorator';
import { RolesGuard } from 'src/_decorators/guards/roles.guard';
import { JwtAuthGuard } from 'src/_decorators/guards/jwt-auth.guard';
import { CreateFilmMemberDto } from './dto/create-film-member.dto';
import { DataType } from 'sequelize-typescript';
import { FilmMember } from './film_members.struct';

@ApiTags('Участники фильмов')
@Controller('api/film-members')
export class FilmMembersController {
    constructor(private filmMembersService: FilmMembersService) {}

    @ApiOperation({ summary: 'Добавление нового участника фильма' })
    @ApiBody({ required: true, type: CreateFilmMemberDto, description: 'Объект с данными о участнике фильма' })
    @ApiResponse({ status: 200, type: FilmMember })
    @UseGuards(JwtAuthGuard)
    @Post()
    createFilmMember(@Body() createFilmMemberDto: CreateFilmMemberDto): Promise<FilmMember> {
        log('createFilmMember');
        return this.filmMembersService.createFilmMember(createFilmMemberDto);
    }

    @ApiOperation({ summary: 'Удаление участника фильма' })
    @ApiParam({ required: true, name: 'id', description: 'id участника фильма', example: 1 })
    @ApiResponse({ status: 200, type: Number, description: "количество удалённых строк" })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete(':id')
    deleteFilmMember(@Param('id') id: number): Promise<number> {
        log('deleteFilmMember');
        return this.filmMembersService.deleteFilmMember(id);
    }
}
