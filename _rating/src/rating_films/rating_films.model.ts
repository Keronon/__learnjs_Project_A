
import { Model, Table, Column, DataType } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface RatingFilmCreationAttrs {
    email: string;
    password: string;
}

@Table({ tableName: 'rating_films' })
export class RatingFilm extends Model<RatingFilm, RatingFilmCreationAttrs> {
    @ApiProperty({ example: '1', description: 'id оценки фильма' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;
}
