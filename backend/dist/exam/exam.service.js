"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExamService", {
    enumerable: true,
    get: function() {
        return ExamService;
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
let ExamService = class ExamService {
    async create(data) {
        const { subjects, subjectIds, id, ...examData } = data;
        // 'subjects' preferred from the payload as per my previous implementation
        const targetSubjects = subjects || subjectIds || [];
        return this.prisma.exam.create({
            data: {
                ...examData,
                subjects: {
                    connect: targetSubjects.map((id)=>({
                            id
                        }))
                }
            },
            include: {
                subjects: true
            }
        });
    }
    async update(id, updateData) {
        const { subjects, subjectIds, ...data } = updateData;
        const targetSubjects = subjects || subjectIds;
        if (targetSubjects) {
            return this.prisma.exam.update({
                where: {
                    id
                },
                data: {
                    ...data,
                    subjects: {
                        set: [],
                        connect: targetSubjects.map((id)=>({
                                id
                            }))
                    }
                },
                include: {
                    subjects: true
                }
            });
        }
        return this.prisma.exam.update({
            where: {
                id
            },
            data: data,
            include: {
                subjects: true
            }
        });
    }
    async findAll() {
        return this.prisma.exam.findMany({
            include: {
                subjects: true
            },
            take: 50
        });
    }
    async findOne(id) {
        return this.prisma.exam.findUnique({
            where: {
                id
            },
            include: {
                subjects: true
            }
        });
    }
    async getRandomTest(examId) {
        const exam = await this.prisma.exam.findUnique({
            where: {
                id: examId
            },
            include: {
                tests: {
                    take: 5,
                    include: {
                        questions: {
                            include: {
                                subject: true
                            }
                        }
                    }
                },
                subjects: true
            }
        });
        if (!exam) {
            throw new _common.NotFoundException('Exam not found');
        }
        if (exam.tests.length === 0) {
            if (exam.subjects && exam.subjects.length > 0) {
                const subjects = exam.subjects;
                const S = subjects.length;
                const N = exam.noOfQuestions || 100;
                if (N < S) throw new Error('Total questions cannot be less than number of subjects');
                const base = Math.floor(N / S);
                const remainder = N % S;
                // Shuffle for fair remainder distribution
                const shuffledSubjects = [
                    ...subjects
                ].sort(()=>0.5 - Math.random());
                const selectedQuestions = [];
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
                        throw new Error(`Insufficient questions in Bank for subject: ${sub.name}. Required: ${allocation}`);
                    }
                    const picked = subQuestions.sort(()=>0.5 - Math.random()).slice(0, allocation);
                    picked.forEach((q)=>selectedQuestions.push({
                            id: q.id
                        }));
                    testSubjectsData.push({
                        subjectId: sub.id,
                        allocatedQuestions: allocation
                    });
                }
                if (selectedQuestions.length > 0) {
                    const newTest = await this.prisma.test.create({
                        data: {
                            name: `${exam.name} Auto-Generated Test`,
                            examId: exam.id,
                            questions: {
                                connect: selectedQuestions
                            },
                            testSubjects: {
                                create: testSubjectsData
                            }
                        },
                        include: {
                            questions: {
                                include: {
                                    subject: true
                                }
                            },
                            testSubjects: {
                                include: {
                                    subject: true
                                }
                            }
                        }
                    });
                    const { tests, ...examInfo } = exam;
                    return {
                        test: newTest,
                        exam: examInfo
                    };
                }
            }
            throw new _common.NotFoundException('No tests found for this exam and no questions available to generate one.');
        }
        // Pick a random test
        const randomTest = exam.tests[Math.floor(Math.random() * exam.tests.length)];
        // Return both test and exam as expected by frontend ArthaTest component
        const { tests, ...examInfo } = exam;
        return {
            test: randomTest,
            exam: examInfo
        };
    }
    async findByTier(tier) {
        return this.prisma.exam.findMany({
            where: {
                name: {
                    contains: `Tier ${tier}`,
                    mode: 'insensitive'
                }
            },
            include: {
                subjects: true
            }
        });
    }
    async remove(id) {
        return this.prisma.exam.delete({
            where: {
                id
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
ExamService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], ExamService);

//# sourceMappingURL=exam.service.js.map