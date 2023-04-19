
import * as bcrypt from 'bcryptjs';
import { BadRequestException,
         ForbiddenException,
         NotFoundException,
         Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/users.model';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async login(authDto: AuthDto): Promise<{ token: string }> {
        const user = await this.validateUser(authDto);
        return this.generateToken(user);
    }

    async registration(authDto: AuthDto) {
        const candidate = await this.usersService.getUserByEmail(authDto.email);
        if (candidate) {
            throw new BadRequestException({ message: 'User with this email already exists' });
        }

        const hashPassword = await bcrypt.hash(authDto.password, 5); // encryption. data, count of rounds (salt)
        const user = await this.usersService.createUser({
            ...authDto,
            password: hashPassword,
        });

        // data + uid -> Profiles
        // await rabbitMQ.publishMessage(RoutingKeys.registrationFromAuth, JSON.stringify(user));
    }

    private async generateToken(user: User) {
        const payload = { email: user.email, id: user.id, role: user.role };
        return {
            token: this.jwtService.sign(payload), // creates token
        };
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.usersService.getUserByEmail(userDto.email);
        if (!user) {
            throw new NotFoundException({
                message: 'Incorrect email',
            });
        }

        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (!passwordEquals) {
            throw new ForbiddenException({
                message: 'Incorrect password',
            });
        }

        return user;
    }
}
