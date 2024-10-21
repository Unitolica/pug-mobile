import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UniversityService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUniversityDto: CreateUniversityDto): Promise<{
        response: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    addCourse(universityId: string, courseId: string): Promise<{
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
    update(id: string, updateUniversityDto: UpdateUniversityDto): Promise<{
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
