
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > C-Professions :`, data, colors.reset );

import { ApiResponse, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { Roles } from 'src/_decorators/roles-auth.decorator';
import { RolesGuard } from 'src/_decorators/guards/roles.guard';
import { Profession } from './professions.struct';

@ApiTags('Профессии работников киноиндустрии')
@UseGuards(RolesGuard)
@Controller('api/professions')
export class ProfessionsController {
    constructor(private professionsService: ProfessionsService) {}

    @ApiOperation({ summary: 'Добавление новой профессии' })
    @ApiParam({ required: true, name: 'name', description: 'название профессии', example: 'актёр' })
    @ApiResponse({ status: 200, type: Profession })
    @Roles('ADMIN')
    @Post(':name')
    createProfession(@Param('name') name: string): Promise<Profession> {
        log('createProfession');
        return this.professionsService.createProfession(name);
    }

    @ApiOperation({ summary: 'Получение всех профессий' })
    @ApiResponse({ status: 200, type: [Profession] })
    @Roles('ADMIN')
    @Get()
    getAllProfessions(): Promise<Profession[]> {
        log('getAllProfessions');
        return this.professionsService.getAllProfessions();
    }

    @ApiOperation({ summary: 'Удаление профессии' })
    @ApiParam({ required: true, name: 'name', description: 'название профессии', example: 'актёр' })
    @ApiResponse({ status: 200, type: Number, description: "количество удалённых строк" })
    @Roles('ADMIN')
    @Delete(':name')
    deleteProfession(@Param('name') name: string): Promise<number> {
        log('deleteProfession');
        return this.professionsService.deleteProfession(name);
    }
}
