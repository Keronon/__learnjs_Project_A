
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > C-Profiles :`, data, colors.reset );

import { ApiBody, ApiResponse, ApiOperation, ApiTags, ApiParam, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Delete, Put, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from './profiles.struct';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RegistrationDto } from './dto/registration.dto';
import { JwtAuthGuard } from 'src/_decorators/guards/jwt-auth.guard';
import { Roles } from 'src/_decorators/roles-auth.decorator';
import { RolesGuard } from 'src/_decorators/guards/roles.guard';

enum RoleNames { Admin = 'ADMIN', User = 'USER' };

@ApiTags('Профили пользователей')
@Controller('api/profiles')
export class ProfilesController {
    constructor(private profilesService: ProfilesService) {}

    @ApiOperation({ summary: 'Регистрация нового аккаунта пользователя' })
    @ApiBody({ type: RegistrationDto, description: 'Объект с данными для регистрации аккаунта' })
    @ApiCreatedResponse({
        schema: { example: { idUser: 1, token: 'h123fgh213fh12j31jh23.h12g3h1' } },
        description: 'Удачная регистрация. Ответ - токен',
    })
    @Post('/reg/user')
    regUser(@Body() registrationDto: RegistrationDto): Promise<{ idUser: number, token: string }> {
        log('regUser');
        return this.profilesService.registration(registrationDto, RoleNames.User);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Регистрация нового аккаунта администратора' })
    @ApiBody({ type: RegistrationDto, description: 'Объект с данными для регистрации аккаунта' })
    @ApiCreatedResponse({
        schema: { example: { idUser: 1, token: 'h123fgh213fh12j31jh23.h12g3h1' } },
        description: 'Удачная регистрация. Ответ - токен',
    })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post('/reg/admin')
    regAdmin(@Body() registrationDto: RegistrationDto): Promise<{ idUser: number, token: string }> {
        log('regAdmin');
        return this.profilesService.registration(registrationDto, RoleNames.Admin);
    }

    @ApiOperation({ summary: 'Получение профиля по его id' })
    @ApiParam({ required: true, name: 'id', description: 'id профиля', example: 1 })
    @ApiResponse({ status: 200, type: Profile })
    @ApiBearerAuth()
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
    @ApiBearerAuth()
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
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put(":id")
    updateProfile(@Param("id") id: number, @Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
        log('updateProfile');
        return this.profilesService.updateProfile(id, updateProfileDto);
    }

    @ApiOperation({ summary: 'Удаление аккаунта' })
    @ApiParam({ required: true, name: 'id', description: 'id профиля', example: 1 })
    @ApiOkResponse({ type: Number, description: "количество удалённых строк" })
    @ApiBearerAuth()
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete(':id')
    deleteAccountByProfileId(@Param('id') id: number): Promise<number> {
        log('deleteAccountByProfileId');
        return this.profilesService.deleteAccountByProfileId(id);
    }
}
