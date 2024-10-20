import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CryptModule } from './crypt/crypt.module';
import { AuthModule } from './auth/auth.module';
import { UniversityModule } from './university/university.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [UserModule, PrismaModule, CryptModule, AuthModule, UniversityModule, CoursesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
