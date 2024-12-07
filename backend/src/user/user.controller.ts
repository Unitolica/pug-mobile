import { Request, Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../auth/res/roles.enum';
import { Roles } from '../auth/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
  me(@Request() req) {
    return this.userService.findById(req.user.id);
  }

  @Patch('updateMyCourses')
  @Roles(Role.STUDENT)
  updateCourses(@Request() req, @Body() coursesString: string[]) {
    const updateUserDto = new UpdateUserDto();
    updateUserDto.courses = coursesString;

    return this.userService.update(req.user.id, updateUserDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query('role') role: string) {
    return this.userService.findAll(role);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
