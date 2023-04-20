
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > C-Profiles :`, data, colors.reset );

import { ApiBody, ApiResponse, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Delete, Put, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from './profiles.model';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RegistrationDto } from './dto/registration.dto';
import { JwtAuthGuard } from 'src/_decorators/guards/jwt-auth.guard';
import { Roles } from 'src/_decorators/roles-auth.decorator';
import { RolesGuard } from 'src/_decorators/guards/roles.guard';

@ApiTags('Профили пользователей')
@Controller('profiles')
export class ProfilesController {
    constructor(private profilesService: ProfilesService) {}

    @ApiOperation({ summary: 'Регистрация нового аккаунта' })
    @ApiBody({ required: true, type: RegistrationDto, description: 'Объект с данными для регистрации аккаунта' })
    @ApiResponse({ status: 200, type: Profile })
    @Post('/registration')
    registration(@Body() registrationDto: RegistrationDto): Promise<Profile> {
        log('registration');
        return this.profilesService.registration(registrationDto);
    }

    @ApiOperation({ summary: 'Получение профиля по его id' })
    @ApiParam({ required: true, name: 'id', description: 'id профиля', example: 1 })
    @ApiResponse({ status: 200, type: Profile })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get(':id')
    getProfileById(@Param('id') id: number): Promise<Profile> {
        log('getProfileById');
        return this.profilesService.getProfileById(id);
    }

    @ApiOperation({ summary: 'Получение профиля по id пользователя, связанного с ним' })
    @ApiParam({ required: true, name: 'id', description: 'id пользователя', example: 1 })
    @ApiResponse({ status: 200, type: Profile })
    @UseGuards(JwtAuthGuard)
    @Get('/user/:id')
    getProfileByUserId(@Param('id') idUser: number): Promise<Profile> {
        log('getProfileByUserId');
        return this.profilesService.getProfileByUserId(idUser);
    }

    @ApiOperation({ summary: 'Изменение данных профиля' })
    @ApiParam({ required: true, name: 'id', description: 'id профиля', example: 1 })
    @ApiBody({ required: true, type: UpdateProfileDto, description: 'Объект с изменёнными полями профиля' })
    @ApiResponse({ status: 200, type: Profile })
    @UseGuards(JwtAuthGuard)
    @Put(":id")
    updateProfile(@Param("id") id: number, @Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
        log('updateProfile');
        return this.profilesService.updateProfile(id, updateProfileDto);
    }

    @ApiOperation({ summary: 'Удаление аккаунта' })
    @ApiParam({ required: true, name: 'id', description: 'id профиля', example: 1 })
    @ApiResponse({ status: 200, type: Profile })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete(':id')
    deleteAccountByProfileId(@Param('id') id: number): void {
        log('deleteAccountByProfileId');
        this.profilesService.deleteAccountByProfileId(id);
    }
}
