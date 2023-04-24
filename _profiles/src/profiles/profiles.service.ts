
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > S-Profiles :`, data, colors.reset );

import * as uuid from 'uuid';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { Profile } from './profiles.struct';
import { RegistrationDto } from './dto/registration.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { QueueNames, RMQ } from 'src/rabbit.core';

@Injectable()
export class ProfilesService {
    constructor(@InjectModel(Profile) private profilesDB: typeof Profile,
                private jwtService: JwtService,
    ) {
        RMQ.connect();
    }

    async registration(registrationDto: RegistrationDto): Promise<{ token: string }>
    {
        log('registration');

        const authData =
        {
            email: registrationDto.email,
            password: registrationDto.password,
        };

        // ! reg data -> Auth
        const id_msg = uuid.v4();
        await RMQ.publishMessage(QueueNames.PA_cmd, {
            id_msg: id_msg,
            cmd: 'registration',
            data: authData,
        });

        // ! res <- Auth
        const res = await RMQ.acceptRes(QueueNames.PA_data, id_msg);

        const user = this.jwtService.verify(res.token);
        const createProfileData = {
            profileName: registrationDto.profileName,
            idUser: user.id,
        };
        await this.profilesDB.create(createProfileData);

        return res; // { token: string }
    }

    async getProfileById(id: number): Promise<Profile> {
        log('getProfileById');

        const profile = await this.profilesDB.findByPk(id);
        return profile;
    }

    async getProfileByUserId(id: number): Promise<Profile> {
        log('getProfileByUserId');

        const profile = await this.profilesDB.findOne({
            where: { idUser: id },
        });
        return profile;
    }

    async updateProfile(id: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
        log('updateProfile');

        const profile = await this.getProfileById(id);
        if (!profile) {
            throw new BadRequestException({ message: 'Profile not found' });
        }

        for (let key in updateProfileDto) {
            profile[key] = updateProfileDto[key];
        }
        await profile.save();

        return profile;
    }

    // TODO : создать метод для изменения фото профиля

    async deleteAccountByProfileId(id: number): Promise<number> {
        log('deleteAccountByProfileId');

        const profile = await this.getProfileById(id);
        if (!profile) {
            throw new NotFoundException({ message: 'Profile not found' });
        }

        // ! del user -> User
        const id_msg = uuid.v4();
        await RMQ.publishMessage(QueueNames.PU_cmd, {
            id_msg: id_msg,
            cmd: 'deleteUserById',
            data: profile.idUser,
        });

        return await this.profilesDB.destroy({ where: { id } });
    }
}
