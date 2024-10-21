"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const geoloc_service_1 = require("../geoloc/geoloc.service");
let TimeLogService = class TimeLogService {
    constructor(prisma, geoloc) {
        this.prisma = prisma;
        this.geoloc = geoloc;
    }
    async create(createTimeLogDto) {
        createTimeLogDto.deniedById = null;
        createTimeLogDto.approvedById = null;
        const [lat, lon] = createTimeLogDto.geolocalization.split(',');
        createTimeLogDto.geolocalization = await this.geoloc.getAddressDescByGeoloc(lat, lon);
        try {
            const verify = await this.prisma.usersOnProjects.findFirst({
                where: {
                    userId: createTimeLogDto.requestedById,
                    projectId: createTimeLogDto.projectId,
                },
            });
            if (!verify) {
                throw { statusCode: 400, message: 'Usuário não está no projeto!' };
            }
            const response = await this.prisma.timeLog.create({
                data: createTimeLogDto
            });
            return { response, message: "Created" };
        }
        catch (error) {
            throw error;
        }
    }
    async findAll() {
        const response = await this.prisma.timeLog.findMany();
        return response;
    }
    async findOne(id) {
        const response = await this.prisma.timeLog.findUnique({
            where: {
                id: id
            }
        });
        return response;
    }
    async update(id, updateTimeLogDto) {
        const response = await this.prisma.timeLog.update({
            where: {
                id: id
            },
            data: updateTimeLogDto
        });
        return { response, message: "Updated" };
    }
    async remove(id) {
        const response = await this.prisma.timeLog.delete({
            where: {
                id: id
            }
        });
        return { message: "Deleted" };
    }
    async approve(id, updateTimeLogDto) {
        if (!updateTimeLogDto.approvedById) {
            throw { statusCode: 400, message: 'ApprovedById is required!' };
        }
        try {
            const response = await this.prisma.timeLog.update({
                where: {
                    id: id
                },
                data: {
                    approvedById: updateTimeLogDto.approvedById
                }
            });
            return { response, message: "Approved" };
        }
        catch (error) {
            return { error, message: "Não foi possível aprovar o registro de tempo!" };
        }
    }
    async deny(id, updateTimeLogDto) {
        if (!updateTimeLogDto.deniedById) {
            throw { statusCode: 400, message: 'DeniedById is required!' };
        }
        try {
            const response = await this.prisma.timeLog.update({
                where: {
                    id: id
                },
                data: {
                    deniedById: updateTimeLogDto.deniedById
                }
            });
            return { response, message: "Denied" };
        }
        catch (error) {
            return { error, message: "Não foi possível aprovar o registro de tempo!" };
        }
    }
};
exports.TimeLogService = TimeLogService;
exports.TimeLogService = TimeLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, geoloc_service_1.GeolocService])
], TimeLogService);
//# sourceMappingURL=time-log.service.js.map