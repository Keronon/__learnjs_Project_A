
import { ApiProperty } from '@nestjs/swagger';

export class GetMemberDto {
    @ApiProperty({ example: 1, description: 'id работника' })
    readonly id: number;

    @ApiProperty({ example: 'Киану Ривз', description: 'имя работника на русском' })
    readonly nameRU: string;

    @ApiProperty({ example: 'Keanu Reeves', description: 'имя работника на английском' })
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
    readonly text: string;
}
