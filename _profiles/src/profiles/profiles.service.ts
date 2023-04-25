
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > S-Profiles :`, data, colors.reset );

import * as uuid from 'uuid';
import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
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

    async registration(registrationDto: RegistrationDto, roleName: string): Promise<{ idUser: number, token: string }>
    {
        log('registration');

        const regData =
        {
            email: registrationDto.email,
            password: registrationDto.password,
            role: roleName
        };

        // ! regData -> Auth -> { idUser: number, token: string }
        const res = await RMQ.publishReq(QueueNames.PA_cmd, QueueNames.PA_data, {
            id_msg: uuid.v4(),
            cmd: 'registration',
            data: regData,
        });
        if (Object.keys(res).length === 0)
            throw new InternalServerErrorException({message: 'Got empty or error response'});

        const createProfileData = {
            profileName: registrationDto.profileName,
            idUser: res.idUser,
        };
        await this.profilesDB.create(createProfileData);

        return res;
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

        // ! idUser -> User -> rows count
        const id_msg = uuid.v4();
        const res = await RMQ.publishReq(QueueNames.PU_cmd, QueueNames.PU_data, {
            id_msg: id_msg,
            cmd: 'deleteUserById',
            data: profile.idUser,
        });
        if (res !== 1) throw new ConflictException({message: 'Can not delete user'});

        return await this.profilesDB.destroy({ where: { id } });
    }
}
