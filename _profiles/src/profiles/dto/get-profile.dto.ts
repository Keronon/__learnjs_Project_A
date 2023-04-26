
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class GetProfileDto {
    @ApiProperty({ example: 1, description: 'id профиля пользователя' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly id: number;

    @ApiProperty({ example: 'Marina', description: 'имя пользователя' })
    @IsString({ message: 'Must be a string' })
    @Length(4, 64, { message: 'Must be longer then 4 and shorter then 64 symbols' })
    readonly profileName: string;

    @ApiProperty({ example: 'avatar.png', description: 'аватар пользователя' })
    @IsString({ message: 'Must be a string' })
    readonly image: string;

    @ApiProperty({ example: 1, description: 'id пользователя' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idUser: number;
}
