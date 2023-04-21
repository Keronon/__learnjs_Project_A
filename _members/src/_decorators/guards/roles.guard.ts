
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles-auth.decorator';
import { CheckAuth } from './jwt-auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (!requiredRoles) {
                return true;
            }

            const user = CheckAuth(context.switchToHttp().getRequest().headers.authorization);

            return requiredRoles.includes(user.role);
        } catch (e) {
            throw new ForbiddenException({message: 'No access'});
        }
    }
}
