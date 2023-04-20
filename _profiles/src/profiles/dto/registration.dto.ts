
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class RegistrationDto {
    @ApiProperty({ example: 'user@mail.ru', description: 'электронная почта' })
    @IsString({ message: 'Must be a string' })
    @IsEmail({}, { message: 'Incorrect email' })
    readonly email: string;

    @ApiProperty({ example: '12cdEF_*', description: 'пароль' })
    @IsString({ message: 'Must be a string' })
    @Length(4, 32, { message: 'Must be longer then 4 and shorter then 32 symbols' })
    readonly password: string;

    @ApiProperty({ example: 'Marina', description: 'имя пользователя' })
    @IsString({ message: 'Must be a string' })
    @Length(4, 64, { message: 'Must be longer then 4 and shorter then 64 symbols' })
    readonly profileName: string;
}
