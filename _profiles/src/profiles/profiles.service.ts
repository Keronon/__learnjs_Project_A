import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from './profiles.model';
import { RegistrationDto } from './dto/registration.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
    constructor(@InjectModel(Profile) private profilesRepository: typeof Profile) {}

    async registration(registrationDto: RegistrationDto): Promise<Profile> {
        const authData = {
            email: registrationDto.email,
            password: registrationDto.password,
        };

        // Отправляем микросервису Auth запрос на регистрацию пользователя
        // await rabbitMQ.publishMessage(
        //   RoutingKeys.registrationFromProfiles,
        //   JSON.stringify(authData)
        // );

        // Ждём ответ от микросервиса Auth
        // await this.answer()

        const createProfileData = {
            profileName: registrationDto.profileName,
            idUser: 1, // изменить на пришедший
        };

        const profile = this.profilesRepository.create(createProfileData);
        return profile;
    }

    async getProfileById(id: number): Promise<Profile> {
        const profile = await this.profilesRepository.findByPk(id);
        return profile;
    }

    // async getProfileByUserId(id: number): Promise<Profile> {
    //     const profile = await this.profilesRepository.findOne({
    //         where: { idUser: id },
    //     });
    //     return profile;
    // }

    async updateProfile(id: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
        // Нужно ли делать put запрос с id, если оно уже есть в body???
        if (id != updateProfileDto.id) {
            throw new HttpException('Id не совпадают', HttpStatus.BAD_REQUEST);
        }

        const profile = await this.getProfileById(id);
        if (!profile) {
            throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
        }

        for (let key in updateProfileDto) {
            profile[key] = updateProfileDto[key];
        }
        profile.save();

        return profile;
    }

    async deleteProfileByIdWithUser(id: number): Promise<void> {
        const profile = await this.getProfileById(id);
        if (!profile) {
            throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
        }

        await this.profilesRepository.destroy({ where: { id } });

        // Отправляем микросервису Auth запрос на удаление пользователя
        // await rabbitMQ.publishMessage(
        //     RoutingKeys.deleteUserFromProfiles,
        //     JSON.stringify({ id: profile.userId }),
        // );
    }

    // private async answer() {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {resolve("res")}, 3000);
    //   });
    // }
}
