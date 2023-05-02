
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > C-Members :`, data, colors.reset );

import { ApiOperation,
         ApiTags,
         ApiParam,
         ApiBody,
         ApiOkResponse,
         ApiNotFoundResponse,
         ApiUnauthorizedResponse,
         ApiForbiddenResponse,
         ApiBearerAuth,
         ApiCreatedResponse,
         ApiBadRequestResponse} from '@nestjs/swagger';
import { Controller, Get, Param, Post, Delete, UseGuards,
         Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../_decorators/roles-auth.decorator';
import { RolesGuard } from '../_decorators/guards/roles.guard';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { GetMemberDto } from './dto/get-member.dto';

@ApiTags('Работники киноиндустрии')
@Controller('api/members')
export class MembersController {
    constructor(private membersService: MembersService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Добавление нового работника (ADMIN)' })
    @ApiBody({ type: CreateMemberDto, description: 'Объект с данными о работнике киноиндустрии' })
    @ApiCreatedResponse({ type: GetMemberDto, description: 'Успех. Ответ - созданный работнике' })
    @ApiBadRequestResponse({
        schema: {
            example: [
                'nameRU - Must be longer then 2 and shorter then 32 symbols',
                'text - Must be longer then 4 and shorter then 512 symbols',
            ],
        },
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
    @UseInterceptors(FileInterceptor( 'image' ))
    @Post()
    createMember(@Body() createMemberDto: CreateMemberDto, @UploadedFile() image): Promise<GetMemberDto> {
        log('createMember');
        return this.membersService.createMember(createMemberDto, image);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Получение всех работников киноиндустрии' })
    @ApiOkResponse({ type: [GetMemberDto], description: 'Успех. Ответ - массив работников' })
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
    @Get()
    getAllMembers(): Promise<GetMemberDto[]> {
        log('getAllMembers');
        return this.membersService.getAllMembers();
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Удаление работника киноиндустрии (ADMIN)' })
    @ApiParam({ name: 'id', description: 'id работника', example: 1 })
    @ApiOkResponse({ type: Number, description: 'Успех. Ответ - количество удалённых строк' })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Member not found' } },
        description: 'Работник не найдена. Ответ - Error: Not Found',
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
    deleteMember(@Param('id') id: number): Promise<number> {
        log('deleteMember');
        return this.membersService.deleteMember(id);
    }
}
