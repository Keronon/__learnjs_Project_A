
import { Model, Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Film } from './../films/films.model';
import { Genre } from './genres.model';

@Table({ tableName: 'film_genres', createdAt: false, updatedAt: false })
export class FilmGenre extends Model<FilmGenre> {
    @ApiProperty({ example: '1', description: 'id связи фильма с жанром' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: '1', description: 'id фильма' })
    @Column({ type: DataType.INTEGER })
    @ForeignKey(() => Film)
    idFilm: number;

    @ApiProperty({ example: '1', description: 'id жанра' })
    @Column({ type: DataType.INTEGER })
    @ForeignKey(() => Genre)
    idGenre: number;
}
