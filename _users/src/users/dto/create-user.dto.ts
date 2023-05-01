
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'user@mail.ru', description: 'электронная почта' })
    @IsString({ message: 'Must be a string' })
    @IsEmail({}, { message: 'Incorrect email' })
    readonly email: string;

    @ApiProperty({ example: '12cdEF_*', description: 'пароль', minimum: 4, maximum: 32})
    @IsString({ message: 'Must be a string' })
    @Length(4, 32, { message: 'Must be longer then 4 and shorter then 32 symbols' })
    readonly password: string;

    @ApiProperty({ example: 'ADMIN', description: 'роль пользователя', minimum: 2, maximum: 12 })
    @IsString({ message: 'Must be a string' })
    @Length(2, 12, { message: 'Must be longer then 2 and shorter then 12 symbols' })
    readonly role: string;
}
