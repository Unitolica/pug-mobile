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
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const consts_1 = require("../../res/consts");
let ProjectService = class ProjectService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createProjectDto) {
        try {
            const response = await this.prisma.project.create({
                data: this.saveProjectDto(createProjectDto)
            });
            const universityErrors = [];
            createProjectDto.universities.forEach(async (universityId) => {
                try {
                    await this.addUniversity(universityId, response.id);
                }
                catch (error) {
                    universityErrors.push(universityId);
                }
            });
            if (universityErrors.length > 0) {
                throw { statusCode: 500, internalCode: 2, message: consts_1.default[2], errors: universityErrors };
            }
            const coursesErrors = [];
            createProjectDto.courses.forEach(async (courseId) => {
                try {
                    const validCourse = await this.prisma.universitiesOnCourses.findFirst({
                        where: {
                            courseId: courseId,
                            universityId: {
                                in: createProjectDto.universities
                            }
                        }
                    });
                    if (!validCourse) {
                        throw { statusCode: 400, internalCode: 1, message: consts_1.default[1], courseId };
                    }
                    await this.addCourse(courseId, response.id);
                }
                catch (error) {
                    coursesErrors.push({ error, courseId });
                }
            });
            if (coursesErrors.length > 0) {
                throw { statusCode: 500, internalCode: 1, message: consts_1.default[1], errors: coursesErrors };
            }
            const usersErrors = [];
            createProjectDto.users.forEach(async (userId) => {
                try {
                    const validUser = await this.prisma.userOnCourses.findFirst({
                        where: {
                            userId,
                            courseId: {
                                in: createProjectDto.courses
                            }
                        }
                    });
                    if (!validUser) {
                        throw { statusCode: 400, internalCode: 3, message: consts_1.default[3], userId };
                    }
                    await this.addUser(userId, response.id);
                }
                catch (error) {
                    usersErrors.push({ error, userId });
                }
            });
            if (usersErrors.length > 0) {
                throw { statusCode: 500, internalCode: 3, message: consts_1.default[3], errors: usersErrors };
            }
            return { response, message: "Created" };
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw { statusCode: 409, internalCode: 0, message: consts_1.default[0] };
            }
            throw { statusCode: 500, message: 'Erro ao Cadastrar Projeto!' };
        }
    }
    saveProjectDto(createProjectDto) {
        const { universities, courses, users, ...project } = createProjectDto;
        return project;
    }
    async addUser(userId, projectId) {
        try {
            const response = await this.prisma.usersOnProjects.create({
                data: {
                    userId,
                    projectId
                }
            });
            return { message: "User Added" };
        }
        catch (error) {
            throw { statusCode: 500, message: 'Internal Server Error' };
        }
    }
    async addUniversity(universityId, projectId) {
        try {
            const response = await this.prisma.universitiesOnProjects.create({
                data: {
                    universityId,
                    projectId
                }
            });
            return { message: "University Added" };
        }
        catch (error) {
            throw { statusCode: 500, message: 'Internal Server Error' };
        }
    }
    async addCourse(courseId, projectId) {
        try {
            const response = await this.prisma.coursesOnProjects.create({
                data: {
                    courseId,
                    projectId
                }
            });
            return { message: "Course Added" };
        }
        catch (error) {
            throw { statusCode: 500, message: 'Internal Server Error' };
        }
    }
    async findAll() {
        const projects = await this.prisma.project.findMany();
        return projects;
    }
    async findOne(id) {
        const response = await this.prisma.project.findUnique({
            where: {
                id,
            },
        });
        if (!response) {
            throw { statusCode: 404, message: "Not Found" };
        }
        return response;
    }
    async update(id, updateProjectDto) {
        try {
            const response = await this.prisma.project.update({
                where: { id },
                data: this.updateProjectDto(updateProjectDto),
            });
            const universityErrors = [];
            await this.prisma.universitiesOnProjects.deleteMany({ where: { projectId: id } });
            updateProjectDto.universities.forEach(async (universityId) => {
                try {
                    await this.addUniversity(universityId, id);
                }
                catch (error) {
                    universityErrors.push(universityId);
                }
            });
            if (universityErrors.length > 0) {
                throw { statusCode: 500, internalCode: 2, message: consts_1.default[2], errors: universityErrors };
            }
            const coursesErrors = [];
            await this.prisma.coursesOnProjects.deleteMany({ where: { projectId: id } });
            updateProjectDto.courses.forEach(async (courseId) => {
                try {
                    const validCourse = await this.prisma.universitiesOnCourses.findFirst({
                        where: {
                            courseId: courseId,
                            universityId: {
                                in: updateProjectDto.universities
                            }
                        }
                    });
                    if (!validCourse) {
                        throw { statusCode: 400, internalCode: 1, message: consts_1.default[1], courseId };
                    }
                    await this.addCourse(courseId, id);
                }
                catch (error) {
                    coursesErrors.push({ error, courseId });
                }
            });
            if (coursesErrors.length > 0) {
                throw { statusCode: 500, internalCode: 1, message: consts_1.default[1], errors: coursesErrors };
            }
            return { response, message: "Updated" };
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw { statusCode: 409, internalCode: 0, message: consts_1.default[0] };
            }
            throw { statusCode: 500, message: 'Internal Server Error' };
        }
    }
    updateProjectDto(updateProjectDto) {
        const { universities, courses, users, ...project } = updateProjectDto;
        return project;
    }
    async remove(id) {
        const response = await this.prisma.project.delete({
            where: { id },
        });
        return { message: "Deleted" };
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectService);
//# sourceMappingURL=project.service.js.map