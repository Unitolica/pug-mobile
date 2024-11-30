import { Request, UseGuards, Get, Body, Post, Controller, HttpCode, Res } from '@nestjs/common';
import { VerifyUserDto } from './dto/verify-user.dto';
import { AuthService } from './auth.service';
import { Public } from './auth.public';
import { Response } from 'express';
import { Role } from './res/roles.enum';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(202)
  @Public()
  @Post()
  async validateUser(@Body() verifyUserDto: VerifyUserDto, @Res({ passthrough: true }) response: Response) {
    const { access_token } = await this.authService.validateUser(verifyUserDto.email, verifyUserDto.password)
    response.cookie('Auth', access_token);
    return { message: 'Accepted' };
  }

  @HttpCode(202)
  @Public()
  @Post('logout')
  async logoutUser(@Res({ passthrough: true }) response: Response) {
    response.cookie('Auth', '');
    return { message: 'Accepted' };
  }

  @Get('profile')
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
  getProfile(@Request() req) {
    return req.user;
  }

}
