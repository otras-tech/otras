"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SubjectService", {
    enumerable: true,
    get: function() {
        return SubjectService;
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
let SubjectService = class SubjectService {
    create(data) {
        const { examId, ...rest } = data;
        return this.prisma.subject.create({
            data: {
                ...rest,
                ...examId && {
                    exams: {
                        connect: {
                            id: examId
                        }
                    }
                }
            }
        });
    }
    findAll() {
        return this.prisma.subject.findMany({
            include: {
                exams: true,
                questions: true
            }
        });
    }
    findOne(id) {
        return this.prisma.subject.findUnique({
            where: {
                id
            },
            include: {
                exams: true,
                questions: true
            }
        });
    }
    update(id, data) {
        const { examId, ...rest } = data;
        return this.prisma.subject.update({
            where: {
                id
            },
            data: {
                ...rest,
                ...examId && {
                    exams: {
                        connect: {
                            id: examId
                        }
                    }
                }
            }
        });
    }
    remove(id) {
        return this.prisma.subject.delete({
            where: {
                id
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
SubjectService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], SubjectService);

//# sourceMappingURL=subject.service.js.map