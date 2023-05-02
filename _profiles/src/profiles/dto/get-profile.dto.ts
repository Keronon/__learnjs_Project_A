
import { ApiProperty } from '@nestjs/swagger';

export class GetProfileDto {
    @ApiProperty({ example: 1, description: 'id профиля пользователя' })
    readonly id: number;

    @ApiProperty({ example: 'Marina', description: 'имя пользователя' })
    readonly profileName: string;

    @ApiProperty({ example: 1, description: 'id пользователя' })
    readonly idUser: number;

    @ApiProperty({
        example: { fileName: 'sjj43b3j43.jpg', base64: 'ahbh2323hh3d' },
        description: `объект с байтами от аватара для пользователя, ` +
            `при нарушении подготовки файла возвращает string: '< ! файл не найден ! >'`,
    })
    readonly image: /*StreamableFile*/ { fileName: string; base64: string } | string;
}
