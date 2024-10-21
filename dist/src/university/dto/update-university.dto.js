"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUniversityDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_university_dto_1 = require("./create-university.dto");
class UpdateUniversityDto extends (0, mapped_types_1.PartialType)(create_university_dto_1.CreateUniversityDto) {
}
exports.UpdateUniversityDto = UpdateUniversityDto;
//# sourceMappingURL=update-university.dto.js.map