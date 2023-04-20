
import { Model, Table, Column, DataType } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface CountryCreationAttrs {
    email: string;
    password: string;
}

@Table({ tableName: 'countries' })
export class Country extends Model<Country, CountryCreationAttrs> {
    @ApiProperty({ example: '1', description: 'id страны' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;
}
