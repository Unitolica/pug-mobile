import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ProjectService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProjectDto: CreateProjectDto): Promise<{
        response: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
        message: string;
    }>;
    saveProjectDto(createProjectDto: CreateProjectDto): {
        name: string;
        description: string;
    };
    addUser(userId: any, projectId: any): Promise<{
        message: string;
    }>;
    addUniversity(universityId: any, projectId: any): Promise<{
        message: string;
    }>;
    addCourse(courseId: any, projectId: any): Promise<{
        message: string;
    }>;
    findAll(): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<{
        response: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
        message: string;
    }>;
    updateProjectDto(updateProjectDto: UpdateProjectDto): {
        name?: string;
        description?: string;
    };
    remove(id: string): Promise<{
        message: string;
    }>;
}
