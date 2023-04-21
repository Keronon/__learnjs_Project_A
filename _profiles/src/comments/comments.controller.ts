
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > C-Users :`, data, colors.reset );

import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comments.struct';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../_decorators/guards/jwt-auth.guard';

@ApiTags('Комментарии к фильмама')
@Controller('api/comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @ApiOperation({ summary: 'Создание нового комментария' })
    @ApiBody({ required: true, type: CreateCommentDto, description: 'Объект с данными для нового комментария' })
    @ApiResponse({ status: 200, type: Comment })
    @UseGuards(JwtAuthGuard)
    @Post()
    createComment(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
        log('createComment');
        return this.commentsService.createComment(createCommentDto);
    }

    @ApiOperation({ summary: 'Получение массива первичных комментариев к фильму' })
    @ApiParam({ required: true, name: 'id', description: 'id фильма', example: 1 })
    @ApiResponse({ status: 200, type: Array<Comment>, isArray: true })
    @UseGuards(JwtAuthGuard)
    @Get('/film/:id')
    getCommentsByFilm(@Param('id') idFilm: number): Promise<Comment[]> {
        log('getCommentsByFilm');
        return this.commentsService.getCommentsByFilm(idFilm);
    }

    @ApiOperation({ summary: 'Получение дерева комментариев к комментарию' })
    @ApiParam({ required: true, name: 'id', description: 'id первичного комментария', example: 1 })
    @ApiResponse({ status: 200, type: Array<Comment>, isArray: true })
    @UseGuards(JwtAuthGuard)
    @Get('/comment/:id')
    getCommentsByComment(@Param('id') idComment: number): Promise<Comment[]> {
        log('getCommentsByComment');
        return this.commentsService.getCommentsByComment(idComment);
    }
}
