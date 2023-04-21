
import { Model, Table, Column, DataType } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface ProfessionCreationAttrs {
}

@Table({ tableName: 'professions' })
export class Profession extends Model<Profession, ProfessionCreationAttrs> {
    @ApiProperty({ example: '1', description: 'id профессии' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;
}
