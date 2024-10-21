import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private reflector;
    private authService;
    private userService;
    constructor(jwtService: JwtService, reflector: Reflector, authService: AuthService, userService: UserService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
