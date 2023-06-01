
import { ApiProperty } from '@nestjs/swagger';

class Role {
    @ApiProperty({ example: 1, description: 'id роли' })
    id: number;

    @ApiProperty({ example: 'ADMIN', description: 'название роли' })
    name: string;

    @ApiProperty({ example: 'Администратор', description: 'описание роли' })
    description: string;
}

export class GetAuthDto {
    @ApiProperty({ example: 1, description: 'id пользователя' })
    readonly idUser: number;

    @ApiProperty({ example: Role, description: 'роль пользователя' })
    readonly role: Role;

    @ApiProperty({ example: 'h123fgh213fh12j31jh23.h12g3h1', description: 'токен' })
    readonly token: string;
}
