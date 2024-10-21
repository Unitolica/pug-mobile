import { INestApplication, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    onModuleInit(): Promise<void>;
    enableShutdownHooks(app: INestApplication): void;
    createIfNotExistsRoot(): Promise<"Root user already exists" | {
        id: string;
        email: string;
        name: string | null;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
