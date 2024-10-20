import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { UniversityModule } from 'src/university/university.module';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [ UniversityModule ],
})
export class CoursesModule {}
