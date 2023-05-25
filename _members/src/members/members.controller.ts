
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
         ApiBadRequestResponse,
         ApiConsumes} from '@nestjs/swagger';
import { Controller, Get, Param, Post, Delete, UseGuards,
         Body, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../_decorators/roles-auth.decorator';
import { RolesGuard } from '../_decorators/guards/roles.guard';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { Member } from './members.struct';

@ApiTags('Работники киноиндустрии')
@Controller('api/members')
export class MembersController {
    constructor(private membersService: MembersService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN) Добавление нового работника' })
    @ApiBody({ type: CreateMemberDto, description: 'Объект с данными о работнике киноиндустрии' })
    @ApiCreatedResponse({ type: Member, description: 'Успех. Ответ - созданный работнике' })
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
    @Post()
    createMember(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
        log('createMember');
        return this.membersService.createMember(createMemberDto);
    }

    @ApiOperation({ summary: '(ADMIN) Получение работника киноиндустрии по id' })
    @ApiParam({ name: 'id', description: 'id работника киноиндустрии', example: 1 })
    @ApiOkResponse({ type: Member, description: 'Успех. Ответ - работник киноиндустрии / ничего(не найден)' })
    @Get(':id')
    getMemberById(@Param('id') id: number): Promise<Member> {
        log('getMemberById');
        return this.membersService.getMemberById(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN) Получение всех работников киноиндустрии' })
    @ApiOkResponse({ type: [Member], description: 'Успех. Ответ - массив работников' })
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
    getAllMembers(): Promise<Member[]> {
        log('getAllMembers');
        return this.membersService.getAllMembers();
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN) Изменение фото работника киноиндустрии' })
    @ApiParam({ name: 'id', description: 'id работника', example: 1 })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: FileUploadDto, description: 'Новое фото работника' })
    @ApiOkResponse({ type: Member, description: 'Успех. Ответ - изменённый работник' })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Member not found' } },
        description: 'Работник не найден. Ответ - Error: Not Found',
    })
    @ApiBadRequestResponse({
        schema: { example: { message: 'No image to set' } },
        description: 'Файл с фото раьотника не прикреплён. Ответ - Error: Bad Request',
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
    @UseInterceptors(FileInterceptor('image'))
    @Put(':id')
    updateImage(@Param('id') id: number, @UploadedFile() image): Promise<Member> {
        log('updateImage');
        return this.membersService.updateImageById(id, image);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN) Удаление работника киноиндустрии' })
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
