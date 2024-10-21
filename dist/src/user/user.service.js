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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypt_service_1 = require("../crypt/crypt.service");
const consts_1 = require("../../res/consts");
let UserService = class UserService {
    constructor(prisma, crypt) {
        this.prisma = prisma;
        this.crypt = crypt;
    }
    async create(createUserDto) {
        createUserDto.password = await this.crypt.encrypt(createUserDto.password);
        try {
            const response = await this.prisma.user.create({
                data: this.saveUserDto(createUserDto)
            });
            const universityErrors = [];
            createUserDto.universities.forEach(async (universityId) => {
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
            createUserDto.courses.forEach(async (courseId) => {
                try {
                    const validCourse = await this.prisma.universitiesOnCourses.findFirst({
                        where: {
                            courseId: courseId,
                            universityId: {
                                in: createUserDto.universities
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
            return { response, message: "Created" };
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw { statusCode: 409, internalCode: 0, message: consts_1.default[0] };
            }
            throw { statusCode: 500, error };
        }
    }
    saveUserDto(createUserDto) {
        const { universities, courses, ...user } = createUserDto;
        return user;
    }
    async addUniversity(universityId, userId) {
        try {
            const response = await this.prisma.userOnUniversities.create({
                data: {
                    universityId,
                    userId
                }
            });
            return { message: "University Added" };
        }
        catch (error) {
            throw { statusCode: 500, message: 'Internal Server Error' };
        }
    }
    async addCourse(courseId, userId) {
        try {
            const response = await this.prisma.userOnCourses.create({
                data: {
                    courseId,
                    userId
                }
            });
            return { message: "Course Added" };
        }
        catch (error) {
            throw { statusCode: 500, message: 'Internal Server Error' };
        }
    }
    async findAll() {
        const response = await this.prisma.user.findMany();
        return response;
    }
    async findById(id) {
        const response = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        return response;
    }
    async findByEmail(email) {
        const response = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        return response;
    }
    async update(id, updateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await this.crypt.encrypt(updateUserDto.password);
        }
        try {
            const response = await this.prisma.user.update({
                where: { id },
                data: this.updateUserDto(updateUserDto),
            });
            const universityErrors = [];
            await this.prisma.userOnUniversities.deleteMany({ where: { userId: id } });
            updateUserDto.universities.forEach(async (universityId) => {
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
            await this.prisma.userOnCourses.deleteMany({ where: { userId: id } });
            updateUserDto.courses.forEach(async (courseId) => {
                try {
                    const validCourse = await this.prisma.universitiesOnCourses.findFirst({
                        where: {
                            courseId: courseId,
                            universityId: {
                                in: updateUserDto.universities
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
            throw { statusCode: 500, message: "Não foi possível Atualizar o usuário!" };
        }
    }
    updateUserDto(updateUserDto) {
        const { universities, courses, ...user } = updateUserDto;
        return user;
    }
    async remove(id) {
        const response = await this.prisma.user.delete({
            where: { id },
        });
        return { message: "Deleted" };
    }
    async userCourses(id) {
        const response = await this.prisma.userOnCourses.findMany({
            where: { userId: id },
            include: {
                course: true
            }
        });
        return response;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, crypt_service_1.CryptService])
], UserService);
//# sourceMappingURL=user.service.js.map