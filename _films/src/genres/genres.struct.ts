import { Model, Table, Column, DataType, BelongsToMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Film } from '../films/films.struct';
import { FilmGenre } from '../film_genres/film-genres.struct';

interface GenreCreationAttrs {
    nameRU: string;
    nameEN: string;
}

@Table({ tableName: 'genres' })
export class Genre extends Model<Genre, GenreCreationAttrs> {
    @ApiProperty({ example: 1, description: 'id жанра фильма' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 'драма', description: 'название жанра фильма на русском' })
    @Column({ type: DataType.TEXT, allowNull: false })
    nameRU: string;

    @ApiProperty({ example: 'drama', description: 'название жанра фильма на английском' })
    @Column({ type: DataType.TEXT, allowNull: false })
    nameEN: string;

    @BelongsToMany(() => Film, () => FilmGenre)
    films: Film[];
}
