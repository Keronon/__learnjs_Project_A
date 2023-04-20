
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ValidationException } from 'src/_exceptions/validation.exception';

// blocks unauthorized users
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    // return : access right
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const user = CheckAuth(context.switchToHttp().getRequest().headers.authorization);

            if (user) return true;
            return false;
        } catch (e) {
            throw new ValidationException({
                message: 'Service can not check authorization',
            });
        }
    }
}

export function CheckAuth(authHeader)
{
    const [ token_type, token ] = authHeader.split(' ');

    if (token_type !== 'Bearer' || !token) {
        throw new UnauthorizedException({
            message: 'User unauthorized',
        });
    }

    return this.jwtService.verify(token); // check and decode token
}
