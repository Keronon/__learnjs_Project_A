
import { Model, Table, Column, DataType } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface RatingUserCreationAttrs {
    email: string;
    password: string;
}

@Table({ tableName: 'rating_users' })
export class RatingUser extends Model<RatingUser, RatingUserCreationAttrs> {
    @ApiProperty({ example: '1', description: 'id пользовательской оценки фильма' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;
}
