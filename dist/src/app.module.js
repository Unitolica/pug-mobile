"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/user.module");
const prisma_module_1 = require("./prisma/prisma.module");
const crypt_module_1 = require("./crypt/crypt.module");
const auth_module_1 = require("./auth/auth.module");
const university_module_1 = require("./university/university.module");
const courses_module_1 = require("./courses/courses.module");
const project_module_1 = require("./project/project.module");
const time_log_module_1 = require("./time-log/time-log.module");
const geoloc_module_1 = require("./geoloc/geoloc.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            prisma_module_1.PrismaModule,
            crypt_module_1.CryptModule,
            auth_module_1.AuthModule,
            university_module_1.UniversityModule,
            courses_module_1.CoursesModule,
            project_module_1.ProjectModule,
            time_log_module_1.TimeLogModule,
            geoloc_module_1.GeolocModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map