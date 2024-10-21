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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const university_service_1 = require("../university/university.service");
const consts_1 = require("../../res/consts");
let CoursesService = class CoursesService {
    constructor(prisma, universityService) {
        this.prisma = prisma;
        this.universityService = universityService;
    }
    async create(createCourseDto) {
        try {
            const response = await this.prisma.course.create({
                data: {
                    name: createCourseDto.name
                }
            });
            const universityErrors = [];
            createCourseDto.universities.forEach(async (universityId) => {
                try {
                    await this.universityService.addCourse(universityId, response.id);
                }
                catch (error) {
                    universityErrors.push(universityId);
                }
            });
            if (universityErrors.length > 0) {
                throw { statusCode: 500, internalCode: 1, message: consts_1.default[1], errors: universityErrors };
            }
            return { response, message: "Created" };
        }
        catch (error) {
            throw { statusCode: 500, message: 'Internal Server Error' };
        }
    }
    async findAll() {
        const response = await this.prisma.course.findMany();
        return response;
    }
    async findOne(id) {
        const response = await this.prisma.course.findUnique({
            where: {
                id,
            },
        });
        if (!response) {
            throw { statusCode: 404, message: "Not Found" };
        }
        return response;
    }
    async update(id, updateCourseDto) {
        try {
            const response = await this.prisma.course.update({
                where: { id },
                data: {
                    name: updateCourseDto.name
                },
            });
            const universityErrors = [];
            const deleted = await this.prisma.universitiesOnCourses.deleteMany({ where: { courseId: id } });
            updateCourseDto.universities.forEach(async (universityId) => {
                try {
                    await this.universityService.addCourse(universityId, response.id);
                }
                catch (error) {
                    universityErrors.push(universityId);
                }
            });
            if (universityErrors.length > 0) {
                throw { statusCode: 500, internalCode: 1, message: consts_1.default[1], errors: universityErrors };
            }
            return { response, message: "Updated" };
        }
        catch (error) {
            throw { statusCode: 500, message: 'Internal Server Error' };
        }
    }
    async findById(id) {
        const response = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!response) {
            throw { statusCode: 404, message: "Not Found" };
        }
        return response;
    }
    async remove(id) {
        const response = await this.prisma.course.delete({
            where: { id },
        });
        return { message: "Deleted" };
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, university_service_1.UniversityService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map