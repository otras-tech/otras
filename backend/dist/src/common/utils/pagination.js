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
exports.PaginatedResultDto = void 0;
exports.buildPaginatedResponse = buildPaginatedResponse;
const swagger_1 = require("@nestjs/swagger");
class PaginatedResultDto {
    data;
    count;
    nextCursor;
    hasNextPage;
}
exports.PaginatedResultDto = PaginatedResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The array of returned items' }),
    __metadata("design:type", Array)
], PaginatedResultDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Count of returned items' }),
    __metadata("design:type", Number)
], PaginatedResultDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The cursor ID to fetch the next sequential page (if any)' }),
    __metadata("design:type", Object)
], PaginatedResultDto.prototype, "nextCursor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Boolean identifying whether there are more pages available' }),
    __metadata("design:type", Boolean)
], PaginatedResultDto.prototype, "hasNextPage", void 0);
function buildPaginatedResponse(items, requestedLimit, cursorField = 'id') {
    const limit = Math.min(requestedLimit || 10, 100);
    const hasNextPage = items.length > limit;
    const edges = hasNextPage ? items.slice(0, limit) : items;
    const nextCursor = hasNextPage && edges.length > 0
        ? edges[edges.length - 1][cursorField]
        : null;
    return {
        data: edges,
        count: edges.length,
        nextCursor,
        hasNextPage,
    };
}
//# sourceMappingURL=pagination.js.map