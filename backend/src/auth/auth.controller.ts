import { Request, UseGuards, Get, Body, Post, Controller, HttpCode, Res } from '@nestjs/common';
import { VerifyUserDto } from './dto/verify-user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from './auth.public';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService) {}

    @HttpCode(202)
    @Public()
    @Post()
    async validateUser(@Body() verifyUserDto: VerifyUserDto, @Res({ passthrough: true }) response: Response) {
        const { access_token } = await this.authService.validateUser(verifyUserDto.email, verifyUserDto.password)
        response.cookie('Auth', access_token);
        return { message: 'Accepted' };
    }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

}
