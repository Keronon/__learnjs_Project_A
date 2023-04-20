
import { colors } from 'src/console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > C-Profiles :`, data, colors.reset );

import { Body, Controller, Get, Param, Post, Delete, Put, Query } from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { ProfilesService } from './profiles.service';
import { Profile } from './profiles.model';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
export class ProfilesController {
    constructor(private profilesService: ProfilesService) {}

    @Post('/registration')
    registration(@Body() registrationDto: RegistrationDto): Promise<Profile> {
        log('registration');
        return this.profilesService.registration(registrationDto);
    }

    @Get(':id')
    getProfileById(@Param('id') id: number): Promise<Profile> {
        log('getProfileById');
        return this.profilesService.getProfileById(id);
    }

    @Get('/user/:id')
    getProfileByUserId(@Param('id') idUser: number): Promise<Profile> {
        log('getProfileByUserId');
        return this.profilesService.getProfileByUserId(idUser);
    }

    @Put(":id")
    updateProfile(@Param("id") id: number, @Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
        log('updateProfile');
        return this.profilesService.updateProfile(id, updateProfileDto);
    }

    @Delete(':id')
    deleteAccountByProfileId(@Param('id') id: number): void {
        log('deleteAccountByProfileId');
        this.profilesService.deleteAccountByProfileId(id);
    }
}
