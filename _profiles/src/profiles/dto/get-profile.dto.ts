
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

    @ApiProperty({ example: {fileName: 'sjj43b3j43.jpg', base64: 'ahbh2323hh3d'}, description: `объект с байтами от аватара для пользователя,
при нарушении подготовки файла возвращает string: '< ! файл не найден ! >'` })
    readonly image: /*StreamableFile*/{fileName: string, base64: string} | string;

    @ApiProperty({ example: 1, description: 'id пользователя' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idUser: number;
}
