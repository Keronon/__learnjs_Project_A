import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRatingProfileDto } from './dto/create-rating-profiles.dto';
import { RatingProfile } from './rating-profiles.struct';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class RatingProfilesService {
    constructor(@InjectModel(RatingProfile) private ratingProfilesDB: typeof RatingProfile) {}

    async сreateRatingProfile(createRatingProfileDto: CreateRatingProfileDto): Promise<RatingProfile> {
        const idFilm = createRatingProfileDto.idFilm;
        const idProfile = createRatingProfileDto.idProfile;

        const ratingProfile = await this.getRatingProfile(idFilm, idProfile);
        if (ratingProfile) {
            ratingProfile.rating = createRatingProfileDto.rating;
            await ratingProfile.save();

            return ratingProfile;
        }

        return await this.ratingProfilesDB.create(createRatingProfileDto);
    }

    private async getRatingProfile(idFilm: number, idProfile: number): Promise<RatingProfile> {
        return await this.ratingProfilesDB.findOne({
            where: {
                [Op.and]: [{ idFilm }, { idProfile }],
             },
        });
    }
}
