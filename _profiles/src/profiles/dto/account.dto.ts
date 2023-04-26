
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, Length } from 'class-validator';

export class AccountDto {
    @ApiProperty({ example: 1, description: 'id профиля пользователя' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idProfile: number;

    @ApiProperty({ example: 'Marina', description: 'имя пользователя' })
    @IsString({ message: 'Must be a string' })
    @Length(4, 64, { message: 'Must be longer then 4 and shorter then 64 symbols' })
    readonly profileName: string;

    @ApiProperty({ example: 'user@mail.ru', description: 'электронная почта' })
    @IsString({ message: 'Must be a string' })
    @IsEmail({}, { message: 'Incorrect email' })
    readonly email: string;
}
