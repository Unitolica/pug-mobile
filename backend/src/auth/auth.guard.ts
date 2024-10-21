
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './res/consts';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './auth.public';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Role } from './res/roles.enum';
import { ROLES_KEY } from './roles.decorator';

  
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const token = request.cookies['Auth'];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.userService.findById(request.user.sub);

      if (!user) {
        throw new UnauthorizedException();
      }

      if (user.role != Role.ADMIN && !requiredRoles.some((role) => user.role === role)) {
        throw new UnauthorizedException();
      }

      const { access_token } = await this.authService.getToken(user.id, user.email);

      const response = context.switchToHttp().getResponse();
      response.cookie('Auth', access_token);

      request['user'] = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
