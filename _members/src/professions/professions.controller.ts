
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > C-Professions :`, data, colors.reset );

import { ApiOperation,
         ApiTags,
         ApiParam,
         ApiOkResponse,
         ApiNotFoundResponse,
         ApiForbiddenResponse,
         ApiBody,
         ApiCreatedResponse,
         ApiBadRequestResponse,
         ApiConflictResponse,
         ApiBearerAuth} from '@nestjs/swagger';
import { Controller, Get, Param, Post, Delete, UseGuards, Body } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { Roles } from 'src/_decorators/roles-auth.decorator';
import { RolesGuard } from 'src/_decorators/guards/roles.guard';
import { Profession } from './professions.struct';
import { CreateProfessionDto } from './dto/create-profession.dto';

@ApiTags('Профессии работников киноиндустрии')
@Controller('api/professions')
export class ProfessionsController {
    constructor(private professionsService: ProfessionsService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Создание профессии (ADMIN)' })
    @ApiBody({ type: CreateProfessionDto, description: 'Объект с данными для новой профессии' })
    @ApiCreatedResponse({ type: Profession, description: 'Успех. Ответ - созданная профессия' })
    @ApiBadRequestResponse({
        schema: { example: ['name - Must be longer then 4 and shorter then 64 symbols'] },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
    })
    @ApiConflictResponse({
        schema: { example: { message: 'This profession already exists' } },
        description: 'Профессия с данным названием уже существует. Ответ - Error: Conflict',
    })
    @ApiForbiddenResponse({
        schema: { example: { message: 'No access' } },
        description: 'Неавторизованный пользователь / доступ запрещён. Ответ - Error: Forbidden',
    })
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Post()
    createProfession(@Body() createProfessionDto: CreateProfessionDto): Promise<Profession> {
        log('createProfession');
        return this.professionsService.createProfession(createProfessionDto);
    }

    @ApiOperation({ summary: 'Получение массива всех профессий' })
    @ApiOkResponse({ type: [Profession], description: 'Успех. Ответ - массив профессий' })
    @Get()
    getAllProfessions(): Promise<Profession[]> {
        log('getAllProfessions');
        return this.professionsService.getAllProfessions();
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Удаление профессии (ADMIN)' })
    @ApiParam({ name: 'id', description: 'id профессии', example: 1 })
    @ApiOkResponse({ type: Number, description: 'Успех. Ответ - количество удалённых строк' })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Profession not found' } },
        description: 'Профессия не найдена. Ответ - Error: Not Found',
    })
    @ApiForbiddenResponse({
        schema: { example: { message: 'No access' } },
        description: 'Неавторизованный пользователь / доступ запрещён. Ответ - Error: Forbidden',
    })
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    deleteProfession(@Param('id') id: number): Promise<number> {
        log('deleteProfession');
        return this.professionsService.deleteProfession(id);
    }
}
