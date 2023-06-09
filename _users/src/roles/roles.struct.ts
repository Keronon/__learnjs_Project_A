
import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.struct';

interface RoleCreationAttrs {
    name: string;
    description: string;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAttrs> {
    @ApiProperty({ example: 1, description: 'id роли' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 'ADMIN', description: 'название роли' })
    @Column({ type: DataType.TEXT, unique: true, allowNull: false })
    name: string;

    @ApiProperty({ example: 'Администратор', description: 'описание роли' })
    @Column({ type: DataType.TEXT, allowNull: false })
    description: string;

    @HasMany(() => User)
    users: User[];
}
