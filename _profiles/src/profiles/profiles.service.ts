
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel      } from '@nestjs/sequelize';
import { Profile          } from './profiles.model';
import { RegistrationDto  } from './dto/registration.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
    constructor(@InjectModel(Profile) private profilesDB: typeof Profile) {}

    async registration(registrationDto: RegistrationDto): Promise<Profile>
    {
        const authData =
        {
            email: registrationDto.email,
            password: registrationDto.password,
        };

        // Отправляем микросервису Auth запрос на регистрацию пользователя
        // await rabbitMQ.publishMessage(
        //   RoutingKeys.registrationFromProfiles,
        //   JSON.stringify(authData)
        // );

        // Ждём ответ от микросервиса Auth
        // await this.waitAnswer()

        const createProfileData =
        {
            profileName: registrationDto.profileName,
            idUser: 1, // изменить на пришедший ↑
        };

        const profile = this.profilesDB.create(createProfileData);
        return profile;
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

        // Отправляем микросервису Auth запрос на удаление пользователя
        // await rabbitMQ.publishMessage(
        //     RoutingKeys.deleteUserFromProfiles,
        //     JSON.stringify({ id: profile.userId }),
        // );
    }

    private async waitAnswer( whatToWait: Promise<any> )
    {
        const timeout = new Promise((res) =>
        {
            setTimeout(() => {res('timeout')}, 3000);
        });

        return Promise.race([ timeout, whatToWait ]);
    }
}
