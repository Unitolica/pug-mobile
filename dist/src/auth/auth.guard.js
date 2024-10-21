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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const consts_1 = require("./res/consts");
const core_1 = require("@nestjs/core");
const auth_public_1 = require("./auth.public");
const auth_service_1 = require("./auth.service");
const user_service_1 = require("../user/user.service");
let AuthGuard = class AuthGuard {
    constructor(jwtService, reflector, authService, userService) {
        this.jwtService = jwtService;
        this.reflector = reflector;
        this.authService = authService;
        this.userService = userService;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(auth_public_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['Auth'];
        if (!token) {
            throw new common_1.UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: consts_1.jwtConstants.secret
            });
            request['user'] = payload;
        }
        catch {
            throw new common_1.UnauthorizedException();
        }
        try {
            const user = await this.userService.findById(request.user.sub);
            const { access_token } = await this.authService.getToken(user.id, user.email);
            const response = context.switchToHttp().getResponse();
            response.cookie('Auth', access_token);
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        core_1.Reflector,
        auth_service_1.AuthService,
        user_service_1.UserService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map