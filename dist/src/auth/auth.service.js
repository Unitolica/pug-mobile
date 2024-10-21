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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const crypt_service_1 = require("../crypt/crypt.service");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(userService, crypt, jwtService) {
        this.userService = userService;
        this.crypt = crypt;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw { statusCode: 404, message: 'Usuário não encontrado!' };
        }
        const validatePassword = await this.crypt.compare(password, user.password);
        if (!validatePassword) {
            throw { statusCode: 404, message: 'Senha errada para usuário!' };
        }
        return this.getToken(user.id, user.email);
    }
    async getToken(sub, email) {
        const payload = { sub, email };
        return { access_token: await this.jwtService.signAsync(payload) };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        crypt_service_1.CryptService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map