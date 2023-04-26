
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Rating_users :`, data, colors.reset);

import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RatingUser } from './rating-users.struct';
import { CreateRatingUserDto } from './dto/create-rating-user.dto';
import { RatingFilmsService } from './../rating_films/rating-films.service';
import { Op } from 'sequelize';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RatingUsersService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(RatingUser) private ratingUsersDB: typeof RatingUser,
        private ratingFilmsService: RatingFilmsService,
    ) {}

    async getRatingUserByFilmIdAndUserId(idFilm: number, idUser: number): Promise<RatingUser> {
        log('getRatingUserByFilmIdAndUserId');

        return await this.ratingUsersDB.findOne({
            where: {
                [Op.and]: [{ idFilm }, { idUser }],
            },
        });
    }

    async сreateRatingUser(authHeader: string, createRatingUserDto: CreateRatingUserDto): Promise<RatingUser> {
        log('createRatingUser');

        const curUser = (() => { log('jwtVerify');
            const [ token_type, token ] = authHeader.split(' ');
            if (token_type !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'User unauthorized'});
            }
            return this.jwtService.verify(token);
        })();

        const idFilm = createRatingUserDto.idFilm;
        const idUser = createRatingUserDto.idUser;

        const ratingUser = await this.getRatingUserByFilmIdAndUserId(idFilm, idUser);
        if (ratingUser) {
            (() => { log('selfGuard');
                if ( curUser.id !== +idUser )
                    throw new ForbiddenException({message: 'No access'});
            })();

            await this.ratingFilmsService.onCreateRatingUser(
                idFilm,
                createRatingUserDto.rating,
                ratingUser.rating,
            );

            ratingUser.rating = createRatingUserDto.rating;
            await ratingUser.save();

            return ratingUser;
        }

        await this.ratingFilmsService.onCreateRatingUser(idFilm, createRatingUserDto.rating);
        return await this.ratingUsersDB.create(createRatingUserDto);
    }
}
