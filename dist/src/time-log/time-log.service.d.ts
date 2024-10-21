import { CreateTimeLogDto } from './dto/create-time-log.dto';
import { UpdateTimeLogDto } from './dto/update-time-log.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeolocService } from 'src/geoloc/geoloc.service';
export declare class TimeLogService {
    private prisma;
    private geoloc;
    constructor(prisma: PrismaService, geoloc: GeolocService);
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
}
