
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateMemberDto {
    @ApiProperty({ example: 'Киану Ривз', description: 'имя работника на русском' })
    @IsString({ message: 'Must be a string' })
    @Length(2, 32, { message: 'Must be longer then 2 and shorter then 32 symbols' })
    readonly nameRU: string;

    @ApiProperty({ example: 'По-гавайски имя Keanu означает «прохладный ветер над горами».', description: 'описание работника' })
    @IsString({ message: 'Must be a string' })
    @Length(4, 64, { message: 'Must be longer then 4 and shorter then 64 symbols' })
    readonly text: string;
}
