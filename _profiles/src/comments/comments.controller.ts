
import { colors } from '../console.colors';
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
         ApiTags,
         ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Body, Controller, Get, Delete, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comments.struct';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Roles } from '../_decorators/roles-auth.decorator';
import { UidGuard } from '../_decorators/guards/uid.guard';
import { GetPrimaryCommentDto } from './dto/get-primary-comment.dto';

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
                'title - Must be longer then 4 and shorter then 128 symbols',
                'text - Must be longer then 10 and shorter then 512 symbols, Must be a string',
            ],
        },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
    })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Previous comment not found' } },
        description: 'Комментируемый комментарий / фильм не найден. Ответ - Error: Not Found',
    })
    @ApiConflictResponse({
        schema: { example: { message: 'IdFilm of the comment and the previous comment do not match' } },
        description: 'Комментируемый комментарий и комментарий имеют разные idFilm. Ответ - Error: Conflict',
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
    @UseGuards(UidGuard)
    @Roles('ME')
    @Post()
    createComment(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
        log('createComment');
        return this.commentsService.createComment(createCommentDto);
    }

    @ApiOperation({ summary: 'Получение массива первичных комментариев к фильму' })
    @ApiParam({ name: 'id', description: 'id фильма', example: 1 })
    @ApiOkResponse({
        type: GetPrimaryCommentDto,
        description: 'Успех. Ответ - массив комментариев с количеством дочерних комментариев',
    })
    @Get('/film/:id')
    getCommentsByFilm(@Param('id') idFilm: number): Promise<GetPrimaryCommentDto[]> {
        log('getCommentsByFilm');
        return this.commentsService.getCommentsByFilm(idFilm);
    }

    @ApiOperation({ summary: 'Получение дерева комментариев к комментарию' })
    @ApiParam({ name: 'id', description: 'id первичного комментария', example: 1 })
    @ApiOkResponse({ type: [Comment], description: 'Успех. Ответ - объект комментария с древовидно вложенными дочерними комментариями' })
    @Get('/comment/:id')
    getCommentsByComment(@Param('id') idComment: number): Promise<any[]> {
        log('getCommentsByComment');
        return this.commentsService.getCommentsByComment(idComment);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Удаление комментария по id' })
    @ApiParam({ name: 'id', description: 'id комментария', example: 1 })
    @ApiOkResponse({ type: Number, description: 'Успех. Ответ - количество удалённых строк' })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Comment not found' } },
        description: 'Комментарий не найден. Ответ - Error: Not Found',
    })
    @ApiUnauthorizedResponse({
        schema: { example: { message: 'User unauthorized' } },
        description: 'Неавторизованный пользователь. Ответ - Error: Unauthorized',
    })
    @ApiForbiddenResponse({
        schema: { example: { message: 'No access' } },
        description: 'Доступ запрещён. Ответ - Error: Forbidden',
    })
    @Delete(':id')
    deleteCommentById(@Headers('Authorization') authHeader, @Param('id') id: number): Promise<number> {
        log('deleteCommentById');
        return this.commentsService.deleteCommentById(authHeader, id);
    }
}
