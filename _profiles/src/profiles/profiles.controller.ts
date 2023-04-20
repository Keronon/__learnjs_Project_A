
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
        return this.profilesService.registration(registrationDto);
    }

    @Get(':id')
    getProfileById(@Param('id') id: number): Promise<Profile> {
        return this.profilesService.getProfileById(id);
    }

    @Get()
    getProfileByUserId(@Query( `uid` ) uid: number): Promise<Profile> {
        return this.profilesService.getProfileByUserId(uid);
    }

    @Put(":id")
    updateProfile(@Param("id") id: number, @Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
        return this.profilesService.updateProfile(id, updateProfileDto);
    }

    @Delete(':id')
    deleteAccountByProfileId(@Param('id') id: number): void {
        this.profilesService.deleteAccountByProfileId(id);
    }
}
