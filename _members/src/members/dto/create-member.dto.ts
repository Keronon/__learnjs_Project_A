
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateMemberDto {
    @ApiProperty({ example: 'Киану Ривз', description: 'имя работника на русском', minimum: 2, maximum: 32 })
    @IsString({ message: 'Must be a string' })
    @Length(2, 32, { message: 'Must be longer then 2 and shorter then 32 symbols' })
    readonly nameRU: string;

    @ApiProperty({
        required: false, example: 'Keanu Reeves',
        description: 'имя работника на английском',
        minimum: 2, maximum: 32
    })
    @IsOptional()
    @IsString({ message: 'Must be a string' })
    @Length(2, 32, { message: 'Must be longer then 2 and shorter then 32 symbols' })
    readonly nameEN: string;

    @ApiProperty({
        example: 'По-гавайски имя Keanu означает «прохладный ветер над горами».',
        description: 'описание работника',
        minimum: 4, maximum: 512
    })
    @IsString({ message: 'Must be a string' })
    @Length(4, 512, { message: 'Must be longer then 4 and shorter then 512 symbols' })
    readonly text: string;
}
