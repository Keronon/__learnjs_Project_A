
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class MembersFilterDto {
    @ApiProperty({ example: 1, description: 'id работника киноиндустрии' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idMember: number;

    @ApiProperty({ example: 1, description: 'id профессии' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idProfession: number;
}
