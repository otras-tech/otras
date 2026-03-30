"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PypService", {
    enumerable: true,
    get: function() {
        return PypService;
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
let PypService = class PypService {
    async create(data) {
        return this.prisma.pYP.create({
            data
        });
    }
    async findAll() {
        return this.prisma.pYP.findMany({
            include: {
                exam: true
            }
        });
    }
    async update(id, data) {
        return this.prisma.pYP.update({
            where: {
                id
            },
            data
        });
    }
    async remove(id) {
        return this.prisma.pYP.delete({
            where: {
                id
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
PypService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], PypService);

//# sourceMappingURL=pyp.service.js.map