
import * as uuid from 'uuid';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel      } from '@nestjs/sequelize';
import { JwtService       } from '@nestjs/jwt';
import { Profile          } from './profiles.struct';
import { RegistrationDto  } from './dto/registration.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RMQ              } from 'src/rabbit.core';

@Injectable()
export class ProfilesService {
    constructor(@InjectModel(Profile) private profilesDB: typeof Profile,
                private jwtService: JwtService)
    {
        RMQ.connect();
    }

    async registration(registrationDto: RegistrationDto): Promise<Profile>
    {
        const authData =
        {
            email: registrationDto.email,       // check 1
            password: registrationDto.password, // check 2
        };

        // reg data -> Auth
        const id_msg = uuid.v4();
        await RMQ.publishReq({
            id_msg: id_msg,
            cmd: 'registration',
            data: authData
        });

        // res <- Auth
        const res = await RMQ.acceptRes(id_msg);

        const user = this.jwtService.verify(res.token);
        const createProfileData =
        {
            profileName: registrationDto.profileName,
            idUser: user.id,
        };
        this.profilesDB.create(createProfileData);

        return res.token; // string
    }

    async getProfileById(id: number): Promise<Profile>
    {
        const profile = await this.profilesDB.findByPk(id);
        return profile;
    }

    async getProfileByUserId(id: number): Promise<Profile>
    {
        const profile = await this.profilesDB.findOne({
            where: { idUser: id },
        });
        return profile;
    }

    async updateProfile(id: number, updateProfileDto: UpdateProfileDto): Promise<Profile>
    {
        if (id != updateProfileDto.id)
        {
            throw new InternalServerErrorException({ message: 'Current user and changing user ids not equal' });
        }

        const profile = await this.getProfileById(id);
        if (!profile)
        {
            throw new BadRequestException({ message: 'Profile not found' });
        }

        for (let key in updateProfileDto)
        {
            profile[key] = updateProfileDto[key];
        }
        profile.save();

        return profile;
    }

    async deleteAccountByProfileId(id: number): Promise<void>
    {
        const profile = await this.getProfileById(id);
        if (!profile)
        {
            throw new NotFoundException({ message: 'Profile not found' });
        }

        await this.profilesDB.destroy({ where: { id } });

        // del user -> Auth
        const id_msg = uuid.v4();
        await RMQ.publishReq({
            id_msg: id_msg,
            cmd: 'deleteUserById',
            data: profile.idUser
        });
    }
}
