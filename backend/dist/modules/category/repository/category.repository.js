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
exports.CategoryRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let CategoryRepository = class CategoryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(name) {
        return this.prisma.mockTestCategory.create({ data: { name } });
    }
    async findAll() {
        return this.prisma.mockTestCategory.findMany({
            where: { isDeleted: false },
            take: 100,
        });
    }
    async findById(id) {
        return this.prisma.mockTestCategory.findUnique({ where: { id } });
    }
    async update(id, name) {
        return this.prisma.mockTestCategory.update({ where: { id }, data: { name } });
    }
    async softDelete(id) {
        return this.prisma.mockTestCategory.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
};
exports.CategoryRepository = CategoryRepository;
exports.CategoryRepository = CategoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryRepository);
//# sourceMappingURL=category.repository.js.map