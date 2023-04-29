
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class GetMemberDto {
    @ApiProperty({ example: 1, description: 'id работника' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly id: number;

    @ApiProperty({ example: 'Киану Ривз', description: 'имя работника на русском' })
    @IsString({ message: 'Must be a string' })
    @Length(2, 32, { message: 'Must be longer then 2 and shorter then 32 symbols' })
    readonly nameRU: string;

    @ApiProperty({ example: 'Keanu Reeves', description: 'имя работника на английском' })
    @IsOptional()
    @IsString({ message: 'Must be a string' })
    @Length(2, 32, { message: 'Must be longer then 2 and shorter then 32 symbols' })
    readonly nameEN: string;

    @ApiProperty({
        example: { fileName: 'sjj43b3j43.jpg', base64: 'ahbh2323hh3d' },
        description: `объект с байтами от аватара для пользователя, ` +
            `при нарушении подготовки файла возвращает string: '< ! файл не найден ! >'`,
    })
    readonly image: /*StreamableFile*/ { fileName: string; base64: string } | string;

    @ApiProperty({
        example: 'По-гавайски имя Keanu означает «прохладный ветер над горами».',
        description: 'описание работника',
    })
    @IsString({ message: 'Must be a string' })
    @Length(4, 64, { message: 'Must be longer then 4 and shorter then 64 symbols' })
    readonly text: string;
}
