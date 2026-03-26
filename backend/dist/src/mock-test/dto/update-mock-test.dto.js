"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMockTestDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_mock_test_dto_1 = require("./create-mock-test.dto");
class UpdateMockTestDto extends (0, mapped_types_1.PartialType)(create_mock_test_dto_1.CreateMockTestDto) {
}
exports.UpdateMockTestDto = UpdateMockTestDto;
//# sourceMappingURL=update-mock-test.dto.js.map