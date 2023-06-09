
import { colors } from '../console.colors';
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
import { Body, Controller, Get, Param, Post, Delete, Headers,
         Put, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilesService } from './profiles.service';
import { RolesGuard } from '../_decorators/guards/roles.guard';
import { UidGuard } from '../_decorators/guards/uid.guard';
import { Roles } from '../_decorators/roles-auth.decorator';
import { RegistrationDto } from './dto/registration.dto';
import { AccountDto } from './dto/account.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { Profile } from './profiles.struct';
import { GetAuthDto } from './dto/get-auth.dto';

enum RoleNames { Admin = 'ADMIN', User = 'USER' }

@ApiTags('Профили пользователей')
@Controller('api/profiles')
export class ProfilesController {
    constructor(private profilesService: ProfilesService) {}

    @ApiOperation({ summary: 'Регистрация нового аккаунта пользователя' })
    @ApiBody({ type: RegistrationDto, description: 'Объект с данными для регистрации аккаунта' })
    @ApiCreatedResponse({ type: GetAuthDto, description: 'Успех. Ответ - id пользователя, роль и токен' })
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
    regUser(@Body() registrationDto: RegistrationDto): Promise<GetAuthDto> {
        log('regUser');
        return this.profilesService.registration(registrationDto, RoleNames.User);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN) Регистрация нового аккаунта администратора' })
    @ApiBody({ type: RegistrationDto, description: 'Объект с данными для регистрации аккаунта' })
    @ApiCreatedResponse({ type: GetAuthDto, description: 'Успех. Ответ - id пользователя, роль и токен' })
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
    regAdmin(@Body() registrationDto: RegistrationDto): Promise<GetAuthDto> {
        log('regAdmin');
        return this.profilesService.registration(registrationDto, RoleNames.Admin);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN | SELF) Получение профиля по id пользователя, связанного с ним' })
    @ApiParam({ name: 'id', description: 'id пользователя', example: 1 })
    @ApiOkResponse({
        type: Profile,
        description: 'Успех. Ответ - профиль пользователя / ничего(не найден)',
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
    @UseGuards(UidGuard)
    @Roles('ME', 'ADMIN')
    @Get('/user/:id')
    getProfileByUserId(@Param('id') idUser: number): Promise<Profile> {
        log('getProfileByUserId');
        return this.profilesService.getProfileByUserId(idUser);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN | SELF) Изменение данных аккаунта' })
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
    @UseGuards(UidGuard)
    @Roles('ME', 'ADMIN')
    @Put()
    updateAccount(@Body() accountDto: AccountDto): Promise<AccountDto> {
        log('updateAccount');
        return this.profilesService.updateAccountByIdUser(accountDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN | SELF) Изменение фото профиля' })
    @ApiParam({ name: 'idUser', description: 'id пользователя', example: 1 })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: FileUploadDto, description: 'Новое фото профиля' })
    @ApiOkResponse({ type: Profile, description: 'Успех. Ответ - изменённый профиль' })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Profile not found' } },
        description: 'Профиль не найден. Ответ - Error: Not Found',
    })
    @ApiBadRequestResponse({
        schema: { example: { message: 'No image to set' } },
        description: 'Файл с фото профиля не прикреплён. Ответ - Error: Bad Request',
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
    @UseGuards(UidGuard)
    @Roles('ME', 'ADMIN')
    @UseInterceptors(FileInterceptor('image'))
    @Put(':idUser')
    updateImage(@Param('idUser') idUser: number, @UploadedFile() image): Promise<Profile> {
        log('updateImage');
        return this.profilesService.updateImageByIdUser(idUser, image);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: '(ADMIN | SELF) Удаление аккаунта' })
    @ApiParam({ name: 'idUser', description: 'id пользователя', example: 1 })
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
    @UseGuards(UidGuard)
    @Roles('ME', 'ADMIN')
    @Delete(':idUser')
    deleteAccountByUserId(@Param('idUser') idUser: number): Promise<number> {
        log('deleteAccountByUserId');
        return this.profilesService.deleteAccountByUserId(idUser);
    }
}
