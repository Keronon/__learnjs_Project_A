
import { Model, Table, Column, DataType } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface RatingFilmCreationAttrs {
    count: number;
    ratingFilm: number;
    ratingCurrent: number;
    idFilm: number;
}

@Table({ tableName: 'ratingFilms' })
export class RatingFilm extends Model<RatingFilm, RatingFilmCreationAttrs> {
    @ApiProperty({ example: 1, description: 'id рейтинга фильма' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 40000, description: 'количество пользовательских оценок фильма' })
    @Column({ type: DataType.INTEGER })
    count: number;

    @ApiProperty({ example: 9.1, description: 'рейтинг фильма' })
    @Column({ type: DataType.INTEGER })
    ratingFilm: number;

    @ApiProperty({ example: 9.0687, description: 'текущей рейтинг фильма' })
    @Column({ type: DataType.INTEGER })
    ratingCurrent: number;

    @ApiProperty({ example: 1, description: 'id фильма' })
    @Column({ type: DataType.INTEGER, unique: true })
    idFilm: number;
}
