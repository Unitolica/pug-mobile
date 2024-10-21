import { TimeLogService } from './time-log.service';
import { CreateTimeLogDto } from './dto/create-time-log.dto';
import { UpdateTimeLogDto } from './dto/update-time-log.dto';
export declare class TimeLogController {
    private readonly timeLogService;
    constructor(timeLogService: TimeLogService);
    create(createTimeLogDto: CreateTimeLogDto): Promise<{
        response: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            geolocalization: string | null;
            projectId: string | null;
            requestedById: string | null;
            approvedById: string | null;
            deniedById: string | null;
        };
        message: string;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        geolocalization: string | null;
        projectId: string | null;
        requestedById: string | null;
        approvedById: string | null;
        deniedById: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        geolocalization: string | null;
        projectId: string | null;
        requestedById: string | null;
        approvedById: string | null;
        deniedById: string | null;
    }>;
    approve(id: string, updateTimeLogDto: UpdateTimeLogDto): Promise<{
        response: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            geolocalization: string | null;
            projectId: string | null;
            requestedById: string | null;
            approvedById: string | null;
            deniedById: string | null;
        };
        message: string;
        error?: undefined;
    } | {
        error: any;
        message: string;
        response?: undefined;
    }>;
    deny(id: string, updateTimeLogDto: UpdateTimeLogDto): Promise<{
        response: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            geolocalization: string | null;
            projectId: string | null;
            requestedById: string | null;
            approvedById: string | null;
            deniedById: string | null;
        };
        message: string;
        error?: undefined;
    } | {
        error: any;
        message: string;
        response?: undefined;
    }>;
    update(id: string, updateTimeLogDto: UpdateTimeLogDto): Promise<{
        response: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            geolocalization: string | null;
            projectId: string | null;
            requestedById: string | null;
            approvedById: string | null;
            deniedById: string | null;
        };
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
