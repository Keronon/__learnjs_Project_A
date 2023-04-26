
import { colors } from './../console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > S-Auth :`, data, colors.reset );

import * as bcrypt from 'bcryptjs';
import { BadRequestException,
         ForbiddenException,
         NotFoundException,
         Injectable,
         ConflictException} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { User } from '../users/users.struct';
import { QueueNames, RMQ } from './../rabbit.core';
import { RegistrationUserDto } from './dto/registration-user.dto';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
                private jwtService: JwtService)
    {
        RMQ.connect().then(RMQ.setCmdConsumer(this, QueueNames.PA_cmd, QueueNames.PA_data));
    }

    async login(authDto: AuthDto): Promise<{ idUser: number, token: string }> {
        log('login');

        const user = await this.usersService.getUserByEmail(authDto.email);
        if (!user) {
            throw new NotFoundException({
                message: 'Incorrect email',
            });
        }

        const passwordEquals = await bcrypt.compare(authDto.password, user.password);
        if (!passwordEquals) {
            throw new ForbiddenException({
                message: 'Incorrect password',
            });
        }

        return { idUser: user.id, token: this.generateToken(user) };
    }

    async registration(regDto: RegistrationUserDto) {
        log('registration');

        const userWithSameEmail = await this.usersService.getUserByEmail(regDto.email);
        if (userWithSameEmail) {
            throw new ConflictException({ message: 'User with this email already exists' });
        }

        // encryption : data, count of rounds (salt)
        const hashPassword = await bcrypt.hash(regDto.password, 5);
        const user = await this.usersService.createUser({
            ...regDto,
            password: hashPassword,
        });

        return { idUser: user.id, token: this.generateToken(user) };
    }

    private generateToken(user: User) {
        log('generateToken');

        const payload = { email: user.email, id: user.id, role: user.role };
        return this.jwtService.sign(payload); // creates token
    }
}
