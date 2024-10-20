import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CryptModule } from './crypt/crypt.module';
import { AuthModule } from './auth/auth.module';
import { UniversityModule } from './university/university.module';
import { CoursesModule } from './courses/courses.module';
import { ProjectModule } from './project/project.module';
import { TimeLogModule } from './time-log/time-log.module';
import { GeolocModule } from './geoloc/geoloc.module';

@Module({
  imports: [
    UserModule, 
    PrismaModule,
    CryptModule, 
    AuthModule, 
    UniversityModule, 
    CoursesModule, 
    ProjectModule, 
    TimeLogModule, 
    GeolocModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
