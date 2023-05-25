
import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Film } from '../films/films.struct';

interface CountryCreationAttrs {
    nameRU: string;
    nameEN: string;
}

@Table({ tableName: 'countries' })
export class Country extends Model<Country, CountryCreationAttrs> {
    @ApiProperty({ example: 1, description: 'id страны' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 'США', description: 'название страны на русском' })
    @Column({ type: DataType.TEXT, unique: true, allowNull: false })
    nameRU: string;

    @ApiProperty({ example: 'USA', description: 'название страны на английском' })
    @Column({ type: DataType.TEXT, unique: true, allowNull: false })
    nameEN: string;

    @HasMany(() => Film)
    films: Film[];
}
