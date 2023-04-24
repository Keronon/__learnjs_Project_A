
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.yellow, `- - > C-Auth :`, data, colors.reset);

import { ApiBody,
         ApiOperation,
         ApiTags,
         ApiOkResponse,
         ApiNotFoundResponse,
         ApiForbiddenResponse,
         ApiBadRequestResponse } from '@nestjs/swagger';
import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Авторизационный пользовательский функционал')
@Controller('api/users')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Авторизация' })
    @ApiBody({ type: AuthDto, description: 'Объект с данными для авторизации' })
    @ApiOkResponse({
        schema: { example: { token: 'h123fgh213fh12j31jh23.h12g3h1' } },
        description: 'Успех. Ответ - токен',
    })
    @ApiNotFoundResponse({
        schema: { example: { message: 'Incorrect email' } },
        description: 'Пользователь с данным email не существует. Ответ - Error: Not Found',
    })
    @ApiForbiddenResponse({
        schema: { example: { message: 'Incorrect password' } },
        description: 'Некорректный пароль. Ответ - Error: Forbidden',
    })
    @ApiBadRequestResponse({
        schema: {
            example: [
                'email - Incorrect email',
                'password - Must be longer then 4 and shorter then 32 symbols',
            ],
        },
        description: 'Ошибки валидации. Ответ - Error: Bad Request',
    })
    @Post('/login')
    @HttpCode(200)
    login(@Body() authDto: AuthDto): Promise<{ idUser: number, token: string }> {
        log('login');
        return this.authService.login(authDto);
    }
}
