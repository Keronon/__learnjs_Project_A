import { Model, Table, Column, DataType, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Country } from '../countries/countries.struct';
import { Genre } from '../genres/genres.struct';
import { FilmGenre } from '../film_genres/film-genres.struct';

interface FilmCreationAttrs {
    nameRU: string;
    nameEN?: string;
    year: number;
    ageRating: string;
    rating?: number;
    duration: number;
    imageName: string;
    idCountry: number;
}

@Table({ tableName: 'films' })
export class Film extends Model<Film, FilmCreationAttrs> {
    @ApiProperty({ example: 1, description: 'id фильма' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 'Зеленая миля', description: 'название фильма (русское)' })
    @Column({ type: DataType.STRING, allowNull: false })
    nameRU: string;

    @ApiProperty({ example: 'The Green Mile', description: 'название фильма (английское)' })
    @Column({ type: DataType.STRING })
    nameEN: string;

    @ApiProperty({ example: 1999, description: 'год выпуска фильма' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    year: number;

    @ApiProperty({ example: '16+', description: 'возрастное ограничение фильма' })
    @Column({ type: DataType.STRING, allowNull: false })
    ageRating: string;

    @ApiProperty({ example: 9.1, description: 'рейтинг фильма' })
    @Column({ type: DataType.INTEGER })
    rating: number;

    @ApiProperty({ example: 189, description: 'длительность фильма (в минутах)' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    duration: number;

    @ApiProperty({ example: './static/u12dflf.png', description: 'путь к изображению фильма' })
    @Column({ type: DataType.STRING, unique: true })
    imageName: string;

    @ApiProperty({ example: 1, description: 'id страны' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => Country)
    idCountry: number;

    @BelongsTo(() => Country)
    country: Country;

    @BelongsToMany(() => Genre, () => FilmGenre)
    genres: Genre[];
}
