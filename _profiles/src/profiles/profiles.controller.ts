
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > C-Profiles :`, data, colors.reset );

import { ApiBody,
         ApiResponse,
         ApiOperation,
         ApiTags,
         ApiParam,
         ApiBearerAuth,
         ApiOkResponse,
         ApiCreatedResponse,
         ApiBadRequestResponse,
         ApiConflictResponse,
         ApiForbiddenResponse,
         ApiNotFoundResponse } from '@nestjs/swagger';
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
        description: 'Успех. Ответ - id пользователя и токен',
    })
    @ApiConflictResponse({
        schema: { example: { message: 'User with this email already exists' } },
        description: 'Пользователь с данным email уже существует. Ответ - Error: Conflict',
    })
    @ApiBadRequestResponse({
        schema: {
            example: [
                'password - Must be longer then 4 and shorter then 32 symbols',
                'profileName - Must be longer then 4 and shorter then 64 symbols, Must be a string',
            ],
        },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
    })
    @Post('/reg/user')
    regUser(@Body() registrationDto: RegistrationDto): Promise<{ idUser: number, token: string }> {
        log('regUser');
        return this.profilesService.registration(registrationDto, RoleNames.User);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Регистрация нового аккаунта администратора (ADMIN)' })
    @ApiBody({ type: RegistrationDto, description: 'Объект с данными для регистрации аккаунта' })
    @ApiCreatedResponse({
        schema: { example: { idUser: 1, token: 'h123fgh213fh12j31jh23.h12g3h1' } },
        description: 'Успех. Ответ - id пользователя и токен',
    })
    @ApiConflictResponse({
        schema: { example: { message: 'User with this email already exists' } },
        description: 'Пользователь с данным email уже существует. Ответ - Error: Conflict',
    })
    @ApiBadRequestResponse({
        schema: {
            example: [
                'password - Must be longer then 4 and shorter then 32 symbols',
                'profileName - Must be longer then 4 and shorter then 64 symbols, Must be a string',
            ],
        },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
    })
    @ApiForbiddenResponse({
        schema: { example: { message: 'No access' } },
        description: 'Неавторизованный пользователь / доступ запрещён. Ответ - Error: Forbidden',
    })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post('/reg/admin')
    regAdmin(@Body() registrationDto: RegistrationDto): Promise<{ idUser: number, token: string }> {
        log('regAdmin');
        return this.profilesService.registration(registrationDto, RoleNames.Admin);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Получение профиля по id' })
    @ApiParam({ name: 'id', description: 'id профиля', example: 1 })
    @ApiOkResponse({ type: Profile, description: 'Успех. Ответ - профиль пользователя / ничего(не найден)' })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get(':id')
    getProfileById(@Param('id') id: number): Promise<Profile> {
        log('getProfileById');
        return this.profilesService.getProfileById(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Получение профиля по id пользователя, связанного с ним' })
    @ApiParam({ name: 'idUser', description: 'id пользователя', example: 1 })
    @ApiResponse({ status: 200, type: Profile })
    @UseGuards(JwtAuthGuard)
    @Get('/user/:idUser')
    getProfileByUserId(@Param('idUser') idUser: number): Promise<Profile> {
        log('getProfileByUserId');
        return this.profilesService.getProfileByUserId(idUser);
    }

    @ApiBearerAuth()
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

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Удаление аккаунта (ADMIN)' })
    @ApiParam({ name: 'id', description: 'id профиля', example: 1 })
    @ApiOkResponse({ type: Number, description: "Успех. Ответ - количество удалённых строк" })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Profile not found' } },
        description: 'Профиль / пользователь не найден. Ответ - Error: Not Found',
    })
    @ApiForbiddenResponse({
        schema: { example: { message: 'No access' } },
        description: 'Неавторизованный пользователь / доступ запрещён. Ответ - Error: Forbidden',
    })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete(':id')
    deleteAccountByProfileId(@Param('id') id: number): Promise<number> {
        log('deleteAccountByProfileId');
        return this.profilesService.deleteAccountByProfileId(id);
    }
}
