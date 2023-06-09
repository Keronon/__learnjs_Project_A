
import { ApiProperty } from '@nestjs/swagger';
import { Model, Table, Column, DataType } from 'sequelize-typescript';

interface FilmInfoCreationAttrs {
    text: string;
    trailerLink?: string;
    idFilm: number;
}

@Table({ tableName: 'filmInfo' })
export class FilmInfo extends Model<FilmInfo, FilmInfoCreationAttrs> {
    @ApiProperty({ example: 1, description: 'id доп информации о фильме' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 'Этот фильм о...', description: 'опиcание фильма' })
    @Column({ type: DataType.TEXT, allowNull: false })
    text: string;

    @ApiProperty({
        required: false,
        example: 'https://widgets.kinopoisk.ru/discovery/film/81338/trailer/47737?noAd=0&embedId=&hidden=&muted=&loop=0&autoplay=1&from=&extraTrailers=&onlyPlayer=1',
        description: 'ссылка на трейлер фильма',
    })
    @Column({ type: DataType.TEXT })
    trailerLink: string;

    @ApiProperty({ example: 1, description: 'id фильма' })
    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    idFilm: number;
}
