
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class GetMembersByIdFilmDto {
    @ApiProperty({ example: 'Киану Ривз', description: 'имя работника на русском' })
    @IsString({ message: 'Must be a string' })
    @Length(2, 32, { message: 'Must be longer then 2 and shorter then 32 symbols' })
    readonly nameRU: string;

    @ApiProperty({
        example: { fileName: 'sjj43b3j43.jpg', base64: 'ahbh2323hh3d' },
        description: `объект с байтами от аватара для пользователя, ` +
            `при нарушении подготовки файла возвращает string: '< ! файл не найден ! >'`,
    })
    readonly image: { fileName: string; base64: string } | string;
}
