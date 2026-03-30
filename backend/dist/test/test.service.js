"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TestService", {
    enumerable: true,
    get: function() {
        return TestService;
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
let TestService = class TestService {
    async create(createTestDto) {
        const { name, examId } = createTestDto;
        // Fetch subjects associated with this exam
        const exam = await this.prisma.exam.findUnique({
            where: {
                id: examId
            },
            include: {
                subjects: true
            }
        });
        if (!exam) throw new Error('Exam not found');
        if (!exam.subjects || exam.subjects.length === 0) {
            throw new Error('This exam has no associated subjects. Please add subjects to the exam before creating a test.');
        }
        const subjects = exam.subjects;
        const S = subjects.length;
        const N = exam.noOfQuestions || 100;
        if (N < S) {
            throw new Error(`Total questions (N=${N}) cannot be less than number of subjects (S=${S}) for fair distribution.`);
        }
        const base = Math.floor(N / S);
        const remainder = N % S;
        // Deterministic Shuffle (Option B) to ensure fair remainder distribution
        const shuffledSubjects = [
            ...subjects
        ].sort(()=>0.5 - Math.random());
        const questionIds = [];
        const testSubjectsData = [];
        for(let i = 0; i < S; i++){
            const sub = shuffledSubjects[i];
            let allocation = base;
            if (i < remainder) allocation += 1;
            const subQuestions = await this.prisma.question.findMany({
                where: {
                    subjectId: sub.id
                },
                select: {
                    id: true
                }
            });
            if (subQuestions.length < allocation) {
                throw new Error(`Insufficient questions in Bank for ${sub.name}. Required: ${allocation}, found: ${subQuestions.length}`);
            }
            // Pick exactly 'allocation' questions from this topic
            const picked = subQuestions.sort(()=>0.5 - Math.random()).slice(0, allocation);
            picked.forEach((q)=>questionIds.push({
                    id: q.id
                }));
            testSubjectsData.push({
                subjectId: sub.id,
                allocatedQuestions: allocation
            });
        }
        return this.prisma.test.create({
            data: {
                name,
                examId,
                questions: {
                    connect: questionIds
                },
                testSubjects: {
                    create: testSubjectsData
                }
            },
            include: {
                questions: {
                    select: {
                        id: true
                    }
                },
                testSubjects: {
                    include: {
                        subject: true
                    }
                },
                exam: true
            }
        });
    }
    findAll() {
        return this.prisma.test.findMany({
            include: {
                exam: true,
                _count: {
                    select: {
                        questions: true
                    }
                }
            },
            take: 50,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async getPreview(examId) {
        const exam = await this.prisma.exam.findUnique({
            where: {
                id: examId
            },
            include: {
                subjects: {
                    include: {
                        _count: {
                            select: {
                                questions: true
                            }
                        }
                    }
                }
            }
        });
        if (!exam || !exam.subjects || exam.subjects.length === 0) return [];
        const S = exam.subjects.length;
        const N = exam.noOfQuestions || 100;
        const base = Math.floor(N / S);
        const remainder = N % S;
        // Return the stable preview (no shuffle needed for preview)
        return exam.subjects.map((sub, i)=>({
                id: sub.id,
                name: sub.name,
                count: i < remainder ? base + 1 : base,
                available: sub._count.questions
            }));
    }
    findOne(id) {
        return this.prisma.test.findUnique({
            where: {
                id
            },
            include: {
                exam: true,
                questions: true
            }
        });
    }
    update(id, updateTestDto) {
        return this.prisma.test.update({
            where: {
                id
            },
            data: updateTestDto
        });
    }
    remove(id) {
        return this.prisma.test.delete({
            where: {
                id
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
TestService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], TestService);

//# sourceMappingURL=test.service.js.map