
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
    @ApiProperty({ example: '1', description: 'id профиля' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly id: number;

    @ApiProperty({ example: '12cdEF_*', description: 'пароль' })
    @IsString({ message: 'Must be a string' })
    @Length(4, 32, { message: 'Must be longer then 4 and shorter then 32 symbols' })
    readonly password: string;

    @ApiProperty({ example: 'Marina', description: 'имя пользователя' })
    @IsString({ message: 'Must be a string' })
    @Length(4, 64, { message: 'Must be longer then 4 and shorter then 64 symbols' })
    readonly profileName: string;

    @ApiProperty({ example: '1', description: 'id пользователя' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idUser: number;
}
