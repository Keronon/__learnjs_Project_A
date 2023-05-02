
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.yellow, `- - > C-Film_members :`, data, colors.reset);

import { ApiOperation,
         ApiTags,
         ApiParam,
         ApiBody,
         ApiForbiddenResponse,
         ApiUnauthorizedResponse,
         ApiCreatedResponse,
         ApiBadRequestResponse,
         ApiOkResponse,
         ApiBearerAuth,
         ApiNotFoundResponse } from '@nestjs/swagger';
import { Controller, Param, Post, Delete, UseGuards, Body, Get } from '@nestjs/common';
import { FilmMembersService } from './film_members.service';
import { Roles } from '../_decorators/roles-auth.decorator';
import { RolesGuard } from '../_decorators/guards/roles.guard';
import { CreateFilmMemberDto } from './dto/create-film-member.dto';
import { FilmMember } from './film_members.struct';
import { GetFilmMembersDto } from './dto/get-film-members.dto';
import { GetSimpleMemberDto } from 'src/members/dto/get-simple-member.dto';

@ApiTags('Участники фильмов')
@Controller('api/film-members')
export class FilmMembersController {
    constructor(private filmMembersService: FilmMembersService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Добавление нового участника фильма' })
    @ApiBody({ type: CreateFilmMemberDto, description: 'Объект с данными о участнике фильма' })
    @ApiCreatedResponse({ type: FilmMember, description: 'Успех. Ответ - созданный участник фильма' })
    @ApiBadRequestResponse({
        schema: { example: ['idFilm - Must be a number', 'idMember - Must be a number'] },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
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
    createFilmMember(@Body() createFilmMemberDto: CreateFilmMemberDto): Promise<FilmMember> {
        log('createFilmMember');
        return this.filmMembersService.createFilmMember(createFilmMemberDto);
    }

    @ApiOperation({ summary: 'Получение всех участников конкретного фильма' })
    @ApiParam({ name: 'idFilm', description: 'id фильма', example: 1 })
    @ApiOkResponse({ type: [GetFilmMembersDto], description: 'Успех. Ответ - массив участников фильма' })
    @Get(':idFilm')
    getMembersByFilmId(@Param('idFilm') idFilm: number): Promise<GetFilmMembersDto[]> {
        log('getMembersByFilmId');
        return this.filmMembersService.getMembersByFilmId(idFilm);
    }

    @ApiOperation({ summary: 'Получение всех участников по определённой профессии' })
    @ApiParam({ name: 'id', description: 'id профессии', example: 1 })
    @ApiOkResponse({ type: [GetSimpleMemberDto], description: 'Успех. Ответ - массив работников' })
    @Get('profession/:id')
    getMembersByProfession(@Param('id') idProfession: number): Promise<GetSimpleMemberDto[]> {
        log('getMembersByProfession');
        return this.filmMembersService.getMembersByProfession(idProfession);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Удаление участника фильма' })
    @ApiParam({ name: 'id', description: 'id участника фильма', example: 1 })
    @ApiOkResponse({ type: Number, description: 'Успех. Ответ - количество удалённых строк' })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Film member not found' } },
        description: 'Участник фильма не найден. Ответ - Error: Not Found',
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
    deleteFilmMember(@Param('id') id: number): Promise<number> {
        log('deleteFilmMember');
        return this.filmMembersService.deleteFilmMember(id);
    }
}
