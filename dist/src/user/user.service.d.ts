import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CryptService } from '../crypt/crypt.service';
export declare class UserService {
    private prisma;
    private crypt;
    constructor(prisma: PrismaService, crypt: CryptService);
    create(createUserDto: CreateUserDto): Promise<{
        response: {
            id: string;
            email: string;
            name: string | null;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    saveUserDto(createUserDto: CreateUserDto): {
        email: string;
        password: string;
        name: string;
    };
    addUniversity(universityId: any, userId: any): Promise<{
        message: string;
    }>;
    addCourse(courseId: any, userId: any): Promise<{
        message: string;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        name: string | null;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        response: {
            id: string;
            email: string;
            name: string | null;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    updateUserDto(updateUserDto: UpdateUserDto): {
        email?: string;
        password?: string;
        name?: string;
    };
    remove(id: string): Promise<{
        message: string;
    }>;
    userCourses(id: string): Promise<({
        course: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        courseId: string;
        userId: string;
    })[]>;
}
