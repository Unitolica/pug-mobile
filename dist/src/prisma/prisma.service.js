"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
        await this.createIfNotExistsRoot();
    }
    enableShutdownHooks(app) {
        process.on('beforeExit', async () => {
            await app.close();
        });
    }
    async createIfNotExistsRoot() {
        const root = await this.user.findFirst({
            where: {
                email: "root@root.com"
            }
        });
        if (root) {
            return "Root user already exists";
        }
        const create = await this.user.create({
            data: {
                email: "root@root.com",
                password: "$2b$04$iXEvdzBC0m6EQUmQ8KqpIeRwmQN.yaK0EhUq02bhwna84KcXswuoy",
            }
        });
        return create;
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map