import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({ example: 'ADMIN', description: 'Значение роли' })
    @IsString({ message: 'Должно быть строкой' })
    readonly name: string;

    @ApiProperty({ example: 'Администратор', description: 'Описание роли' })
    @IsString({ message: 'Должно быть строкой' })
    readonly description: string;
}
