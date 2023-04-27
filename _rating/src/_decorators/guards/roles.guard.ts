
import { colors } from '../../console.colors';
const log = ( data: any ) => console.log( colors.fg.magenta, `- - > GR-Rating :`, data, colors.reset );

import {
    Injectable,
    CanActivate,
    ExecutionContext,
    InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles-auth.decorator';
import { checkAuth } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector,
                protected jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        log('canActivate');

        const user = checkAuth(this.jwtService, context.switchToHttp().getRequest().headers.authorization);
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (!requiredRoles) { return true; }
            return requiredRoles.includes(user.role.name);
        } catch (e) {
            throw new InternalServerErrorException({message: 'Can not check access'});
        }
    }
}
