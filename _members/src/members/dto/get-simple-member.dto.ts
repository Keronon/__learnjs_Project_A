
import { ApiProperty } from '@nestjs/swagger';

export class GetSimpleMemberDto {
    @ApiProperty({ example: 1, description: 'id работника' })
    readonly id: number;

    @ApiProperty({ example: 'Киану Ривз', description: 'имя работника на русском' })
    readonly nameRU: string;

    @ApiProperty({ example: 'Keanu Reeves', description: 'имя работника на английском' })
    readonly nameEN: string;
}
