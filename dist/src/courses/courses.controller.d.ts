import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(createCourseDto: CreateCourseDto): Promise<{
        response: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    findAll(): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<{
        response: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
