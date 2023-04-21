
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > C-Profiles :`, data, colors.reset );

import { ApiResponse, ApiOperation, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { Controller, Get, Param, Post, Delete, UseGuards, Body } from '@nestjs/common';
import { Roles } from 'src/_decorators/roles-auth.decorator';
import { RolesGuard } from 'src/_decorators/guards/roles.guard';
import { JwtAuthGuard } from 'src/_decorators/guards/jwt-auth.guard';
import { DataType } from 'sequelize-typescript';
import { MembersService } from './members.service';
import { Member } from './members.struct';
import { CreateMemberDto } from './dto/create-member.dto';

@ApiTags('Работники киноиндустрии')
@Controller('api/members')
export class MembersController {
    constructor(private membersService: MembersService) {}

    @ApiOperation({ summary: 'Добавление нового работника киноиндустрии' })
    @ApiBody({ required: true, type: CreateMemberDto, description: 'Объект с данными о работнике киноиндустрии' })
    @ApiResponse({ status: 200, type: Member })
    @UseGuards(JwtAuthGuard)
    @Post()
    createMember(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
        log('createMember');
        return this.membersService.createMember(createMemberDto);
    }

    @ApiOperation({ summary: 'Получение всех работников киноиндустрии' })
    @ApiResponse({ status: 200, type: [Member] })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get()
    getMembers(): Promise<Member[]> {
        log('getMembers');
        return this.membersService.getMembers();
    }

    @ApiOperation({ summary: 'Удаление работника киноиндустрии' })
    @ApiParam({ required: true, name: 'id', description: 'id работника', example: 1 })
    @ApiResponse({ status: 200, type: DataType.BOOLEAN })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete(':id')
    deleteMember(@Param('id') id: number): Promise<boolean> {
        log('deleteMember');
        return this.membersService.deleteMember(id);
    }
}
