"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTimeLogDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_time_log_dto_1 = require("./create-time-log.dto");
class UpdateTimeLogDto extends (0, mapped_types_1.PartialType)(create_time_log_dto_1.CreateTimeLogDto) {
}
exports.UpdateTimeLogDto = UpdateTimeLogDto;
//# sourceMappingURL=update-time-log.dto.js.map