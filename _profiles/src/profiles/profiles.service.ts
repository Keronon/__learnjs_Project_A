
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Profiles :`, data, colors.reset);

import * as uuid from 'uuid';
import { BadRequestException,
         Injectable,
         InternalServerErrorException,
         NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { QueueNames, RMQ } from '../rabbit.core';
import { addFile, deleteFile, getFile } from '../files.core';
import { Profile } from './profiles.struct';
import { RegistrationDto } from './dto/registration.dto';
import { AccountDto } from './dto/account.dto';
import { GetProfileDto } from './dto/get-profile.dto';
import { CommentsService } from 'src/comments/comments.service';

@Injectable()
export class ProfilesService {
    constructor(private commentsService: CommentsService,
                @InjectModel(Profile) private profilesDB: typeof Profile)
    {
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

    async getProfileByUserId(idUser: number): Promise<GetProfileDto> {
        log('getProfileByUserId');

        const profile = await this.profilesDB.findOne({ where: { idUser } });
        return profile ? this.setImageAsFile(profile) : null;
    }

    async getSimpleProfileByUserId(idUser: number): Promise<Profile> {
        log('getSimpleProfileByUserId');
        const profile = await this.profilesDB.findOne({ where: { idUser } });
        if (!profile) throw new NotFoundException({ message: 'Profile not found' });
        return profile;
    }

    async updateAccountByIdUser(accountDto: AccountDto): Promise<AccountDto> {
        log('updateAccountByIdUser');

        const profile = await this.getSimpleProfileByUserId(accountDto.idUser);

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

    async updateImageByIdUser(idUser: number, image: any): Promise<GetProfileDto> {
        log('updateImageByIdUser');

        let profile = await this.getSimpleProfileByUserId(idUser);

        if (!image) throw new BadRequestException({ message: 'No image to set' });

        if (profile.imageName) deleteFile(profile.imageName);

        profile.imageName = addFile(image);
        profile = await profile.save();

        return this.setImageAsFile(profile);
    }

    async deleteAccountByUserId(idUser: number): Promise<number> {
        log('deleteAccountByUserId');

        const profile = await this.getSimpleProfileByUserId(idUser);

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
        return await this.commentsService.deleteCommentsByProfileId(profile.id) +
               await this.profilesDB.destroy({ where: { idUser } });
    }

    setImageAsFile(profile: Profile): GetProfileDto {
        log('setImageAsFile');

        const data = {
            ...profile.dataValues,
            image: getFile(profile.imageName ?? '_no_avatar.png'),
        };
        delete data.imageName;

        return data;
    }
}
