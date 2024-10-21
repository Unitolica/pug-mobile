import { UniversityService } from './university.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
export declare class UniversityController {
    private readonly universityService;
    constructor(universityService: UniversityService);
    create(createUniversityDto: CreateUniversityDto): Promise<{
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
