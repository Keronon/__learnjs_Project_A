
import { colors } from 'src/console.colors';
const log = (data: any) => console.log(colors.fg.yellow, `- - > C-Profiles :`, data, colors.reset);

import { ApiBody,
         ApiOperation,
         ApiTags,
         ApiParam,
         ApiBearerAuth,
         ApiOkResponse,
         ApiCreatedResponse,
         ApiBadRequestResponse,
         ApiConflictResponse,
         ApiForbiddenResponse,
         ApiNotFoundResponse,
         ApiUnauthorizedResponse,
         ApiConsumes } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Delete,
         Put, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilesService } from './profiles.service';
import { RegistrationDto } from './dto/registration.dto';
import { AccountDto } from './dto/account.dto';
import { GetProfileDto } from './dto/get-profile.dto';
import { JwtAuthGuard } from '../_decorators/guards/jwt-auth.guard';
import { Roles } from '../_decorators/roles-auth.decorator';
import { RolesGuard } from '../_decorators/guards/roles.guard';
import { FileUploadDto } from '../_files/file-upload.dto';

enum RoleNames { Admin = 'ADMIN', User = 'USER' }

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
    regUser(@Body() registrationDto: RegistrationDto): Promise<{ idUser: number; token: string }> {
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
    @Post('/reg/admin')
    regAdmin(@Body() registrationDto: RegistrationDto): Promise<{ idUser: number; token: string }> {
        log('regAdmin');
        return this.profilesService.registration(registrationDto, RoleNames.Admin);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Получение профиля по id' })
    @ApiParam({ name: 'id', description: 'id профиля', example: 1 })
    @ApiOkResponse({ type: GetProfileDto, description: 'Успех. Ответ - профиль пользователя / ничего(не найден)' })
    @ApiUnauthorizedResponse({
        schema: { example: { message: 'User unauthorized' } },
        description: 'Неавторизованный пользователь. Ответ - Error: Unauthorized',
    })
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getProfileById(@Param('id') id: number): Promise<GetProfileDto> {
        log('getProfileById');
        return this.profilesService.getProfileById(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Получение профиля по id пользователя, связанного с ним' })
    @ApiParam({ name: 'idUser', description: 'id пользователя', example: 1 })
    @ApiOkResponse({
        type: GetProfileDto,
        description: 'Успех. Ответ - профиль пользователя / ничего(не найден)',
    })
    @ApiUnauthorizedResponse({
        schema: { example: { message: 'User unauthorized' } },
        description: 'Неавторизованный пользователь. Ответ - Error: Unauthorized',
    })
    @UseGuards(JwtAuthGuard)
    @Get('/user/:idUser')
    getProfileByUserId(@Param('idUser') idUser: number): Promise<GetProfileDto> {
        log('getProfileByUserId');
        return this.profilesService.getProfileByUserId(idUser);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Изменение данных аккаунта' })
    @ApiBody({ type: AccountDto, description: 'Объект с изменёнными полями аккаунта' })
    @ApiOkResponse({ type: AccountDto, description: 'Успех. Ответ - изменённый аккаунт' })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Profile not found' } },
        description: 'Профиль / пользователь не найден. Ответ - Error: Not Found',
    })
    @ApiConflictResponse({
        schema: { example: { message: 'User with this email already exists' } },
        description: 'Пользователь с данным email уже существует. Ответ - Error: Conflict',
    })
    @ApiBadRequestResponse({
        schema: {
            example: [
                'profileName - Must be longer then 4 and shorter then 64 symbols',
                'email - Incorrect email',
            ],
        },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
    })
    @ApiUnauthorizedResponse({
        schema: { example: { message: 'User unauthorized' } },
        description: 'Неавторизованный пользователь. Ответ - Error: Unauthorized',
    })
    @UseGuards(JwtAuthGuard)
    @Put()
    updateAccount(@Body() accountDto: AccountDto): Promise<AccountDto> {
        log('updateAccount');
        return this.profilesService.updateAccount(accountDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Изменение фото профиля' })
    @ApiParam({ name: 'id', description: 'id профиля', example: 1 })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: FileUploadDto, description: 'Новое фото профиля' })
    @ApiOkResponse({ type: GetProfileDto, description: 'Успех. Ответ - изменённый профиль' })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Profile not found' } },
        description: 'Профиль не найден. Ответ - Error: Not Found',
    })
    @ApiBadRequestResponse({
        schema: { example: { message: 'Image is empty' } },
        description: 'Файл с фото профиля не прикреплён. Ответ - Error: Bad Request',
    })
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    @Put(':id')
    updateImage(@Param('id') id: number, @UploadedFile() image): Promise<GetProfileDto> {
        log('updateImage');
        return this.profilesService.updateImage(id, image);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Удаление аккаунта (ADMIN)' })
    @ApiParam({ name: 'id', description: 'id профиля', example: 1 })
    @ApiOkResponse({ type: Number, description: 'Успех. Ответ - количество удалённых строк' })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Profile not found' } },
        description: 'Профиль не найден. Ответ - Error: Not Found',
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
    deleteAccountByProfileId(@Param('id') id: number): Promise<number> {
        log('deleteAccountByProfileId');
        return this.profilesService.deleteAccountByProfileId(id);
    }
}
