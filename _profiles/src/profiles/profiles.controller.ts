import { Body, Controller, Get, Param, Post, Delete, Put } from '@nestjs/common';
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

    // @Get(':id')
    // getProfileById(@Param('id') id: number): Promise<Profile> {
    //     return this.profilesService.getProfileById(id);
    // }

    // @Get('/user/:id')
    // getProfileByUserId(@Param('id') id: number): Promise<Profile> {
    //     return this.profilesService.getProfileByUserId(id);
    // }

    // @Put(":id")
    // updateProfile(@Param("id") id: number, @Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
    //   return this.profilesService.updateProfile(id, updateProfileDto);
    // }

    // @Delete(':id')
    // deleteProfileByIdWithUser(@Param('id') id: number): void {
    //     this.profilesService.deleteProfileByIdWithUser(id);
    // }
}
