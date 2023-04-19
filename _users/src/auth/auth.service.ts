import { User } from '../users/users.model';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { UsersService } from './../users/users.service';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto/auth.dto';

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
            throw new HttpException(
                'Пользователь с таким email существует',
                HttpStatus.BAD_REQUEST,
            );
        }

        // bcrypt.hash - пароль + соль
        const hashPassword = await bcrypt.hash(authDto.password, 5);
        const user = await this.usersService.createUser({
            ...authDto,
            password: hashPassword,
        });

        // Отправляем микросервису Profiles сообщение с созданным пользователем
        // await rabbitMQ.publishMessage(RoutingKeys.registrationFromAuth, JSON.stringify(user));
    }

    private async generateToken(user: User) {
        const payload = { email: user.email, id: user.id, roles: user.role };
        return {
            // sign - метод, который используется для создания JWT-токена
            token: this.jwtService.sign(payload),
        };
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.usersService.getUserByEmail(userDto.email);
        if (!user) {
            throw new UnauthorizedException({
                message: 'Некорректный email',
            });
        }

        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (!passwordEquals) {
            throw new UnauthorizedException({
                message: 'Некорректный пароль',
            });
        }

        return user;
    }
}
