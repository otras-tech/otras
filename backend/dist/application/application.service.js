"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationService", {
    enumerable: true,
    get: function() {
        return ApplicationService;
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
let ApplicationService = class ApplicationService {
    async create(userId, examId) {
        return this.prisma.application.upsert({
            where: {
                userId_examId: {
                    userId,
                    examId
                }
            },
            update: {},
            create: {
                userId,
                examId
            }
        });
    }
    async findByUser(userId) {
        return this.prisma.application.findMany({
            where: {
                userId
            },
            include: {
                exam: true
            }
        });
    }
    async findByOtrId(otrId) {
        const user = await this.prisma.user.findUnique({
            where: {
                otrId
            }
        });
        if (!user) return [];
        return this.prisma.application.findMany({
            where: {
                userId: user.id
            },
            include: {
                exam: true
            }
        });
    }
    async findAll() {
        return this.prisma.application.findMany({
            include: {
                user: true,
                exam: true
            }
        });
    }
    async updateStatus(id, statusData) {
        return this.prisma.application.update({
            where: {
                id
            },
            data: statusData
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
ApplicationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], ApplicationService);

//# sourceMappingURL=application.service.js.map