
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
         ApiConsumes} from '@nestjs/swagger';
import { Controller, Get, Param, Post, Delete, UseGuards,
         Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../_decorators/roles-auth.decorator';
import { RolesGuard } from '../_decorators/guards/roles.guard';
import { JwtAuthGuard } from '../_decorators/guards/jwt-auth.guard';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { GetMemberDto } from './dto/get-member.dto';

@ApiTags('Работники киноиндустрии')
@Controller('api/members')
export class MembersController {
    constructor(private membersService: MembersService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Добавление нового работника (ADMIN)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateMemberDto, description: 'Объект с данными о работнике киноиндустрии' })
    @ApiCreatedResponse({ type: GetMemberDto, description: 'Успех. Ответ - созданный работнике' })
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
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor( 'image' ))
    @Post()
    createMember(@Body() createMemberDto: CreateMemberDto, @UploadedFile() image): Promise<GetMemberDto> {
        log('createMember');
        return this.membersService.createMember(createMemberDto, image);
    }

    @ApiOperation({ summary: 'Получение всех работников киноиндустрии' })
    @ApiOkResponse({ type: [GetMemberDto], description: 'Успех. Ответ - массив профессий' })
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
