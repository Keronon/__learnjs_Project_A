
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.yellow, `- - > C-Auth :`, data, colors.reset );

import { ApiBody, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Авторизационный пользовательский функционал')
@Controller('api/users')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Авторизация' })
    @ApiBody({ required: true, type: AuthDto, description: 'Объект с данными для авторизации' })
    @ApiResponse({ status: 200, schema: {example: {token: 'h123fgh213fh12j31jh23.h12g3h1'}} })
    @Post('/login')
    login(@Body() authDto: AuthDto): Promise<{ token: string }> {
        log('login');
        return this.authService.login(authDto);
    }
}
