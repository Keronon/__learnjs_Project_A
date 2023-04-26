
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > C-Comments :`, data, colors.reset );

import { ApiBadRequestResponse,
         ApiBearerAuth,
         ApiBody,
         ApiConflictResponse,
         ApiCreatedResponse,
         ApiForbiddenResponse,
         ApiNotFoundResponse,
         ApiOkResponse,
         ApiOperation,
         ApiParam,
         ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comments.struct';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../_decorators/guards/jwt-auth.guard';

@ApiTags('Комментарии к фильму')
@Controller('api/comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Создание нового комментария' })
    @ApiBody({ type: CreateCommentDto, description: 'Объект с данными для нового комментария' })
    @ApiCreatedResponse({ type: Comment, description: 'Успех. Ответ - созданный комментарий' })
    @ApiBadRequestResponse({
        schema: {
            example: [
                'title - Must be longer then 10 and shorter then 128 symbols',
                'text - Must be longer then 10 and shorter then 512 symbols, Must be a string',
            ],
        },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
    })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Previous comment not found' } },
        description: 'Комментируемый комментарий не найден. Ответ - Error: Not Found',
    })
    @ApiConflictResponse({
        schema: { example: { message: 'IdFilm of the comment and the previous comment do not match' } },
        description: 'Комментируемый комментарий и комментарий имеют разные idFilm. Ответ - Error: Conflict',
    })
    @ApiForbiddenResponse({
        schema: { example: { message: 'No access' } },
        description: 'Неавторизованный пользователь / доступ запрещён. Ответ - Error: Forbidden',
    })
    @UseGuards(JwtAuthGuard)
    @Post()
    createComment(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
        log('createComment');
        return this.commentsService.createComment(createCommentDto);
    }

    @ApiOperation({ summary: 'Получение массива первичных комментариев к фильму' })
    @ApiParam({ required: true, name: 'id', description: 'id фильма', example: 1 })
    @ApiOkResponse({ type: [Comment], description: 'Успех. Ответ - массив комментариев' })
    @Get('/film/:id')
    getCommentsByFilm(@Param('id') idFilm: number): Promise<Comment[]> {
        log('getCommentsByFilm');
        return this.commentsService.getCommentsByFilm(idFilm);
    }

    @ApiOperation({ summary: 'Получение дерева комментариев к комментарию' })
    @ApiParam({ required: true, name: 'id', description: 'id первичного комментария', example: 1 })
    @ApiOkResponse({ type: [Comment], description: 'Успех. Ответ - массив комментариев' })
    @Get('/comment/:id')
    getCommentsByComment(@Param('id') idComment: number): Promise<Comment[]> {
        log('getCommentsByComment');
        return this.commentsService.getCommentsByComment(idComment);
    }
}
