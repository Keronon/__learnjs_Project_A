
import { Model, Table, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Role } from '../roles/roles.struct';
import { ApiProperty } from '@nestjs/swagger';

interface UserCreationAttrs {
    email: string;
    password: string;
    idRole?: number;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({ example: 1, description: 'id пользователя' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 'user@mail.ru', description: 'электронная почта' })
    @Column({ type: DataType.TEXT, unique: true, allowNull: false })
    email: string;

    @ApiProperty({ example: '12cdEF_*', description: 'пароль' })
    @Column({ type: DataType.TEXT, allowNull: false })
    password: string;

    @ApiProperty({ example: 1, description: 'id роли' })
    @Column({ type: DataType.INTEGER })
    @ForeignKey(() => Role)
    idRole: number;

    @BelongsTo(() => Role)
    role: Role;
}
