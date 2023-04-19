import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddRoleDto {
    @ApiProperty({ example: 'ADMIN', description: 'Значение роли' })
    @IsString({ message: 'Должно быть строкой' })
    readonly value: string;

    @ApiProperty({ example: 1, description: 'Id пользователя' })
    @IsNumber({}, { message: 'Должно быть числом' })
    readonly userId: number;
}
