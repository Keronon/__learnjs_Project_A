import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

// Роль - ограничить доступ до каких-либо эндпоинтов неавторизованным пользователям
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    // Возвращает - разрешён ли доступ
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            const authHeader = req.headers.authorization;
            // Тип токена
            const bearer = authHeader.split(' ')[0];
            // Токен
            const token = authHeader.split(' ')[1];

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({
                    message: 'Пользователь не авторизован',
                });
            }

            // verify - декодирует токен
            const user = this.jwtService.verify(token);
            req.user = user;
            return true;
        } catch (e) {
            throw new UnauthorizedException({
                message: 'Пользователь не авторизован',
            });
        }
    }
}
