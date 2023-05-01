
import { ApiProperty } from '@nestjs/swagger';

export class GetMembersByIdFilmDto {
    @ApiProperty({ example: 'Киану Ривз', description: 'имя работника на русском' })
    readonly nameRU: string;

    @ApiProperty({
        example: { fileName: 'sjj43b3j43.jpg', base64: 'ahbh2323hh3d' },
        description: `объект с байтами от аватара для пользователя, ` +
            `при нарушении подготовки файла возвращает string: '< ! файл не найден ! >'`,
    })
    readonly image: { fileName: string; base64: string } | string;
}
