
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Profiles :`, data, colors.reset);

import * as uuid from 'uuid';
import { BadRequestException,
         Injectable,
         InternalServerErrorException,
         NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueueNames, RMQ } from '../rabbit.core';
import { addFile, deleteFile } from '../files.core';
import { Profile } from './profiles.struct';
import { RegistrationDto } from './dto/registration.dto';
import { AccountDto } from './dto/account.dto';
import { GetAuthDto } from './dto/get-auth.dto';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class ProfilesService {
    constructor(@InjectModel(Profile) private profilesDB: typeof Profile,
                private commentsService: CommentsService)
    {
        RMQ.connect();
    }

    async registration(registrationDto: RegistrationDto, roleName: string): Promise<GetAuthDto> {
        log('registration');

        const regData = {
            email: registrationDto.email,
            password: registrationDto.password,
            role: roleName,
        };

        // ! regData -> micro Auth -> GetAuthDto
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

    async getProfileByUserId(idUser: number): Promise<Profile> {
        log('getProfileByUserId');

        const profile = await this.profilesDB.findOne({ where: { idUser } });
        return profile;
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

    async updateImageByIdUser(idUser: number, image: any): Promise<Profile> {
        log('updateImageByIdUser');

        const profile = await this.getSimpleProfileByUserId(idUser);

        if (!image) throw new BadRequestException({ message: 'No image to set' });

        if (profile.imageName) deleteFile(profile.imageName);

        profile.imageName = addFile(image);
        await profile.save()

        return profile;
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

        await this.commentsService.deleteCommentsByProfileId(profile.id);
        return await this.profilesDB.destroy({ where: { idUser } });
    }
}
