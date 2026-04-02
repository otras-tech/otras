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
exports.PypRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let PypRepository = class PypRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.pYP.create({ data });
    }
    async findAll() {
        return this.prisma.pYP.findMany({
            where: { isDeleted: false },
            include: { exam: true },
        });
    }
    async findById(id) {
        return this.prisma.pYP.findUnique({ where: { id } });
    }
    async update(id, data) {
        return this.prisma.pYP.update({ where: { id }, data });
    }
    async softDelete(id) {
        return this.prisma.pYP.update({ where: { id }, data: { isDeleted: true } });
    }
};
exports.PypRepository = PypRepository;
exports.PypRepository = PypRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PypRepository);
//# sourceMappingURL=pyp.repository.js.map