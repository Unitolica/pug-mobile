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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversityController = void 0;
const common_1 = require("@nestjs/common");
const university_service_1 = require("./university.service");
const create_university_dto_1 = require("./dto/create-university.dto");
const update_university_dto_1 = require("./dto/update-university.dto");
let UniversityController = class UniversityController {
    constructor(universityService) {
        this.universityService = universityService;
    }
    create(createUniversityDto) {
        return this.universityService.create(createUniversityDto);
    }
    findAll() {
        return this.universityService.findAll();
    }
    findOne(id) {
        return this.universityService.findOne(id);
    }
    update(id, updateUniversityDto) {
        return this.universityService.update(id, updateUniversityDto);
    }
    remove(id) {
        return this.universityService.remove(id);
    }
};
exports.UniversityController = UniversityController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_university_dto_1.CreateUniversityDto]),
    __metadata("design:returntype", void 0)
], UniversityController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UniversityController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UniversityController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_university_dto_1.UpdateUniversityDto]),
    __metadata("design:returntype", void 0)
], UniversityController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UniversityController.prototype, "remove", null);
exports.UniversityController = UniversityController = __decorate([
    (0, common_1.Controller)('university'),
    __metadata("design:paramtypes", [university_service_1.UniversityService])
], UniversityController);
//# sourceMappingURL=university.controller.js.map