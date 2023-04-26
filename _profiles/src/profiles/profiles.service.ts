
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > S-Profiles :`, data, colors.reset );

import * as uuid from 'uuid';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from './profiles.struct';
import { RegistrationDto } from './dto/registration.dto';
import { AccountDto } from './dto/account.dto';
import { QueueNames, RMQ } from 'src/rabbit.core';
import { GetProfileDto } from './dto/get-profile.dto';
import { addFile, getStreamableFile } from 'src/files.core';

@Injectable()
export class ProfilesService {
    constructor(@InjectModel(Profile) private profilesDB: typeof Profile) {
        RMQ.connect();
    }

    async registration(registrationDto: RegistrationDto, roleName: string, image: any): Promise<{ idUser: number; token: string }> {
        log('registration');

        const regData = {
            email: registrationDto.email,
            password: registrationDto.password,
            role: roleName
        };

        // ! regData -> micro Auth -> { idUser: number, token: string }
        const res = await RMQ.publishReq(QueueNames.PA_cmd, QueueNames.PA_data, {
            id_msg: uuid.v4(),
            cmd: 'registration',
            data: regData,
        });
        if (Object.keys(res).length === 0)
            throw new InternalServerErrorException({ message: 'Got empty or error response' });

        const createProfileData = {
            profileName: registrationDto.profileName,
            idUser: res.idUser,
        };
        await this.profilesDB.create(createProfileData);
        addFile(image);

        return res;
    }

    async getProfileByIdWithoutConversion(id: number): Promise<Profile> {
        log('getProfileByIdWithoutConversion');
        return await this.profilesDB.findByPk(id);
    }

    async getProfileById(id: number): Promise<GetProfileDto> {
        log('getProfileById');

        const profile = await this.profilesDB.findByPk(id);
        return this.convertProfileToGetProfileDto(profile);
    }

    async getProfileByUserId(idUser: number): Promise<GetProfileDto> {
        log('getProfileByUserId');

        const profile = await this.profilesDB.findOne({
            where: { idUser },
        });

        return this.convertProfileToGetProfileDto(profile);
    }

    async updateAccount(accountDto: AccountDto, image: any): Promise<AccountDto> {
        log('updateAccount');

        const profile = await this.getProfileByIdWithoutConversion(accountDto.idProfile);
        if (!profile) {
            throw new NotFoundException({ message: 'Profile not found' });
        }

        // ! updateUserData -> micro User -> User
        const res = await RMQ.publishReq(QueueNames.PU_cmd, QueueNames.PU_data, {
            id_msg: uuid.v4(),
            cmd: 'updateUser',
            data: { id: profile.idUser, email: accountDto.email },
        });
        if (Object.keys(res).length === 0)
            throw new InternalServerErrorException({ message: 'Got empty or error response' });

        profile.profileName = accountDto.profileName;
        await profile.save();

        return accountDto;
    }

    // TODO : создать метод для изменения фото профиля

    async deleteAccountByProfileId(id: number): Promise<number> {
        log('deleteAccountByProfileId');

        const profile = await this.getProfileByIdWithoutConversion(id);
        if (!profile) {
            throw new NotFoundException({ message: 'Profile not found' });
        }

        // ! idUser -> micro User -> rows count
        const res = await RMQ.publishReq(QueueNames.PU_cmd, QueueNames.PU_data, {
            id_msg: uuid.v4(),
            cmd: 'deleteUserById',
            data: profile.idUser,
        });
        if (res !== 1) throw new InternalServerErrorException({ message: 'Can not delete user' });

        return await this.profilesDB.destroy({ where: { id } });
    }

    private convertProfileToGetProfileDto(profile: Profile): GetProfileDto
    {
        log('convertProfileToGetProfileDto');

        const dto = {
            id: profile.id,
            profileName: profile.profileName,
            image: getStreamableFile(profile.imageName ?? '_no_avatar.png'),
            idUser: profile.idUser,
        };

        return dto;
    }
}
