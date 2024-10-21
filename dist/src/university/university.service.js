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
exports.UniversityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UniversityService = class UniversityService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUniversityDto) {
        try {
            const response = await this.prisma.university.create({
                data: createUniversityDto
            });
            return { response, message: "Created" };
        }
        catch (error) {
            throw { statusCode: 500, message: 'Erro ao criar Universidade!' };
        }
    }
    async addCourse(universityId, courseId) {
        try {
            const response = await this.prisma.universitiesOnCourses.create({
                data: {
                    universityId,
                    courseId
                }
            });
            return { message: "Course Added" };
        }
        catch (error) {
            throw { statusCode: 500, message: 'Erro ao adicionar curso!' };
        }
    }
    async findAll() {
        const response = await this.prisma.university.findMany();
        return response;
    }
    async findOne(id) {
        const response = await this.prisma.university.findUnique({
            where: {
                id,
            },
        });
        if (!response) {
            throw { statusCode: 404, message: "Not Found" };
        }
        return response;
    }
    async update(id, updateUniversityDto) {
        try {
            const response = await this.prisma.university.update({
                where: { id },
                data: updateUniversityDto,
            });
            return { response, message: "Updated" };
        }
        catch (error) {
            throw { statusCode: 500, message: 'Internal Server Error' };
        }
    }
    async remove(id) {
        const response = await this.prisma.university.delete({
            where: { id },
        });
        return { message: "Deleted" };
    }
};
exports.UniversityService = UniversityService;
exports.UniversityService = UniversityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UniversityService);
//# sourceMappingURL=university.service.js.map