import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UniversityService } from 'src/university/university.service';
export declare class CoursesService {
    private prisma;
    private universityService;
    constructor(prisma: PrismaService, universityService: UniversityService);
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
    findById(id: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
