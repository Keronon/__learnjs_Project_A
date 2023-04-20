
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddRoleDto {
    @ApiProperty({ example: 'ADMIN', description: 'название роли' })
    @IsString({ message: 'Must be a string' })
    readonly role_name: string;

    @ApiProperty({ example: 1, description: 'id пользователя' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly id_user: number;
}
