"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CategoryService", {
    enumerable: true,
    get: function() {
        return CategoryService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CategoryService = class CategoryService {
    create(createCategoryDto) {
        return this.prisma.mockTestCategory.create({
            data: createCategoryDto
        });
    }
    findAll() {
        return this.prisma.mockTestCategory.findMany({
            take: 100
        });
    }
    findOne(id) {
        return this.prisma.mockTestCategory.findUnique({
            where: {
                id
            }
        });
    }
    update(id, updateCategoryDto) {
        return this.prisma.mockTestCategory.update({
            where: {
                id
            },
            data: updateCategoryDto
        });
    }
    remove(id) {
        return this.prisma.mockTestCategory.delete({
            where: {
                id
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
CategoryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], CategoryService);

//# sourceMappingURL=category.service.js.map