"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "QuestionService", {
    enumerable: true,
    get: function() {
        return QuestionService;
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
let QuestionService = class QuestionService {
    create(data) {
        const { subjectId, ...rest } = data;
        return this.prisma.question.create({
            data: {
                ...rest,
                subject: {
                    connect: {
                        id: subjectId
                    }
                }
            }
        });
    }
    findAll(query) {
        const where = {};
        if (query?.subjectId) where.subjectId = query.subjectId;
        if (query?.examId) {
            where.tests = {
                some: {
                    examId: query.examId
                }
            };
        }
        return this.prisma.question.findMany({
            where,
            include: {
                subject: true
            }
        });
    }
    findOne(id) {
        return this.prisma.question.findUnique({
            where: {
                id
            },
            include: {
                subject: true
            }
        });
    }
    update(id, data) {
        const { subjectId, ...rest } = data;
        const updateData = {
            ...rest
        };
        if (subjectId) {
            updateData.subject = {
                connect: {
                    id: subjectId
                }
            };
        }
        return this.prisma.question.update({
            where: {
                id
            },
            data: updateData
        });
    }
    remove(id) {
        return this.prisma.question.delete({
            where: {
                id
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
QuestionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], QuestionService);

//# sourceMappingURL=question.service.js.map