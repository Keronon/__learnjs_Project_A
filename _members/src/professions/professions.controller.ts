
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > C-Profiles :`, data, colors.reset );

import { ApiResponse, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { Roles } from 'src/_decorators/roles-auth.decorator';
import { RolesGuard } from 'src/_decorators/guards/roles.guard';
import { DataType } from 'sequelize-typescript';
import { Profession } from './professions.struct';

@ApiTags('Профессии работников киноиндустрии')
@Controller('api/professions')
export class ProfessionsController {
    constructor(private professionsService: ProfessionsService) {}

    @ApiOperation({ summary: 'Добавление новой профессии' })
    @ApiParam({ required: true, name: 'name', description: 'название профессии', example: 'актёр' })
    @ApiResponse({ status: 200, type: Profession })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post(':name')
    createProfession(@Param('name') name: string): Promise<Profession> {
        log('createProfession');
        return this.professionsService.createProfession(name);
    }

    @ApiOperation({ summary: 'Получение всех профессий' })
    @ApiResponse({ status: 200, type: [Profession] })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get()
    getProfessions(): Promise<Profession[]> {
        log('getProfessions');
        return this.professionsService.getProfessions();
    }

    @ApiOperation({ summary: 'Удаление профессии' })
    @ApiParam({ required: true, name: 'name', description: 'название профессии', example: 'актёр' })
    @ApiResponse({ status: 200, type: DataType.BOOLEAN })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete(':name')
    deleteProfession(@Param('name') name: string): Promise<boolean> {
        log('deleteProfession');
        return this.professionsService.deleteProfession(name);
    }
}
