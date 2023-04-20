
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > C-Auth :`, data, colors.reset );

import { ApiBody, ApiResponse, PartialType, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Авторизационный пользовательский функционал')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Авторизация' })
    @ApiBody({ required: true, type: AuthDto, description: 'Объект с данными для авторизации' })
    @ApiResponse({ status: 200, type: PartialType<{token: string}> })
    @Post('/login')
    login(@Body() authDto: AuthDto): Promise<{ token: string }> {
        log('login');
        return this.authService.login(authDto);
    }
}
