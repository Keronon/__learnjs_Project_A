
import { ApiProperty } from '@nestjs/swagger';

export class GetRoleDto {
    @ApiProperty({ example: 1, description: 'id роли' })
    id: number;

    @ApiProperty({ example: 'ADMIN', description: 'название роли' })
    name: string;

    @ApiProperty({ example: 'Администратор', description: 'описание роли' })
    description: string;
}
