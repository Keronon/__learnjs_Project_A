
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class AuthDto {
    @ApiProperty({ example: 'user@mail.ru', description: 'электронная почта' })
    @IsString({ message: 'Must be a string' })
    @IsEmail({}, { message: 'Incorrect email' })
    readonly email: string;

    @ApiProperty({ example: '12cdEF_*', description: 'пароль', minimum: 4, maximum: 32 })
    @IsString({ message: 'Must be a string' })
    @Length(4, 32, { message: 'Must be longer then 4 and shorter then 32 symbols' })
    readonly password: string;
}
