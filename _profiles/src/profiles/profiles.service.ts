
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Profiles :`, data, colors.reset);

import * as uuid from 'uuid';
import { BadRequestException,
         Injectable,
         InternalServerErrorException,
         NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from './profiles.struct';
import { RegistrationDto } from './dto/registration.dto';
import { AccountDto } from './dto/account.dto';
import { QueueNames, RMQ } from '../rabbit.core';
import { GetProfileDto } from './dto/get-profile.dto';
import { addFile, deleteFile, getFile } from '../_files/files.core';

@Injectable()
export class ProfilesService {
    constructor(@InjectModel(Profile) private profilesDB: typeof Profile) {
        RMQ.connect();
    }

    async registration(registrationDto: RegistrationDto, roleName: string): Promise<{ idUser: number; token: string }> {
        log('registration');

        const regData = {
            email: registrationDto.email,
            password: registrationDto.password,
            role: roleName,
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

        return res;
    }

    async getProfileByIdWithoutConversion(id: number): Promise<Profile> {
        log('getProfileByIdWithoutConversion');
        return await this.profilesDB.findByPk(id);
    }

    async getProfileById(id: number): Promise<GetProfileDto> {
        log('getProfileById');

        const profile = await this.profilesDB.findByPk(id);
        return this.setImageAsFile(profile);
    }

    async getProfileByUserId(idUser: number): Promise<GetProfileDto> {
        log('getProfileByUserId');

        const profile = await this.profilesDB.findOne({
            where: { idUser },
        });

        return this.setImageAsFile(profile);
    }

    async updateAccount(accountDto: AccountDto): Promise<AccountDto> {
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

    async updateImage(id: number, image: any): Promise<GetProfileDto> {
        log('updateImage');

        const profile = await this.getProfileByIdWithoutConversion(id);
        if (!profile) {
            throw new NotFoundException({ message: 'Profile not found' });
        }

        if (!image) {
            throw new BadRequestException({ message: 'Image is empty' });
        }
        if (profile.imageName) {
            deleteFile(profile.imageName);
        }

        profile.imageName = addFile(image);
        await profile.save();

        return this.setImageAsFile(profile);
    }

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

        if (profile.imageName) {
            deleteFile(profile.imageName);
        }
        return await this.profilesDB.destroy({ where: { id } });
    }

    private setImageAsFile(profile: Profile): GetProfileDto {
        log('setImageAsFile');

        const data = {
            ...profile.dataValues,
            image: getFile(profile.imageName ?? '_no_avatar.png'),
        };
        delete data.imageName;

        return data;
    }
}
