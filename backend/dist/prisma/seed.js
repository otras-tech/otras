"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting comprehensive seed...');
    console.log('Cleaning up database...');
    await prisma.intelligenceFeedback.deleteMany({});
    await prisma.arthaAssessment.deleteMany({});
    await prisma.arthaProfile.deleteMany({});
    await prisma.studyActivity.deleteMany({});
    await prisma.studyPlanDay.deleteMany({});
    await prisma.studyPlan.deleteMany({});
    await prisma.careerReadinessTestScore.deleteMany({});
    await prisma.mockTestAttempt.deleteMany({});
    await prisma.referralReward.deleteMany({});
    await prisma.referral.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.result.deleteMany({});
    await prisma.application.deleteMany({});
    await prisma.pYP.deleteMany({});
    await prisma.mockTest.deleteMany({});
    await prisma.test.deleteMany({});
    await prisma.question.deleteMany({});
    await prisma.subject.deleteMany({});
    await prisma.exam.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.mockTestCategory.deleteMany({});
    await prisma.job.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.subscription.deleteMany({});
    console.log('Creating test user...');
    const testUser = await prisma.user.create({
        data: {
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@example.com',
            password: await bcrypt.hash('password123', 10),
            otrId: 'UP123456',
            referralCode: 'REF123456',
        }
    });
    console.log('Creating test admin...');
    await prisma.admin.create({
        data: {
            username: 'admin',
            email: 'admin@otras.com',
            password: await bcrypt.hash('admin123', 10),
        }
    });
    const subjectNames = ['quant', 'logical', 'verbal', 'General Awareness', 'Technical Aptitude'];
    const subjects = [];
    for (const name of subjectNames) {
        const s = await prisma.subject.create({ data: { name } });
        subjects.push(s);
    }
    const exams = await Promise.all([
        prisma.exam.create({
            data: {
                name: 'SSC CGL 2026',
                shortDescription: 'SSC Graduate Level',
                longDescription: 'The Staff Selection Commission Combined Graduate Level Examination is a national level competitive exam.',
                cutoff: 145.5,
                syllabus: 'Quant, Reasoning, English, GA',
                eligibility: 'Bachelor\'s Degree',
                pattern: 'SSC',
                noOfQuestions: 100,
                subjects: { connect: subjects.slice(0, 4).map(s => ({ id: s.id })) }
            }
        }),
        prisma.exam.create({
            data: {
                name: 'UPSC CSE 2026',
                shortDescription: 'Civil Services Exam',
                longDescription: 'The Civil Services Examination is a nationwide competitive examination in India conducted by the Union Public Service Commission.',
                cutoff: 92.0,
                syllabus: 'General Studies, CSAT',
                eligibility: 'Graduate',
                pattern: 'UPSC',
                noOfQuestions: 100,
                subjects: { connect: subjects.slice(0, 4).map(s => ({ id: s.id })) }
            }
        }),
        prisma.exam.create({
            data: {
                name: 'JEE Mains 2026',
                shortDescription: 'Engineering Entrance',
                longDescription: 'Joint Entrance Examination – Main is an Indian standardized computer-based test for admission to various technical undergraduate programs.',
                cutoff: 85.0,
                syllabus: 'Physics, Chemistry, Maths',
                eligibility: '12th Pass',
                pattern: 'JEE',
                noOfQuestions: 90,
                subjects: { connect: subjects.filter(s => ['quant', 'Technical Aptitude'].includes(s.name)).map(s => ({ id: s.id })) }
            }
        })
    ]);
    const quantSubject = subjects.find(s => s.name === 'quant');
    const logicalSubject = subjects.find(s => s.name === 'logical');
    const verbalSubject = subjects.find(s => s.name === 'verbal');
    for (let i = 1; i <= 40; i++) {
        await prisma.question.create({
            data: {
                text: `Quant Question ${i}: Solve the mathematical problem.`,
                options: [
                    'Option A: 10',
                    'Option B: 20',
                    'Option C: 30',
                    'Option D: 40'
                ],
                answer: 'Option B: 20',
                subjectId: quantSubject.id,
            }
        });
    }
    for (let i = 1; i <= 30; i++) {
        await prisma.question.create({
            data: {
                text: `Logical Reasoning ${i}: Find the correct pattern.`,
                options: [
                    'Option A',
                    'Option B',
                    'Option C',
                    'Option D'
                ],
                answer: 'Option A',
                subjectId: logicalSubject.id,
            }
        });
    }
    for (let i = 1; i <= 30; i++) {
        await prisma.question.create({
            data: {
                text: `Verbal Ability ${i}: Choose the correct synonym.`,
                options: [
                    'Option A',
                    'Option B',
                    'Option C',
                    'Option D'
                ],
                answer: 'Option C',
                subjectId: verbalSubject.id,
            }
        });
    }
    for (const subject of subjects) {
        for (let i = 1; i <= 20; i++) {
            await prisma.question.create({
                data: {
                    text: `${subject.name} - Concept Check ${i}: What is the primary characteristic of this topic?`,
                    options: ['Option A: Definitive', 'Option B: Variable', 'Option C: Null', 'Option D: Infinite'],
                    answer: 'Option A: Definitive',
                    subjectId: subject.id,
                }
            });
        }
    }
    for (let t = 1; t <= 5; t++) {
        const testQs = [];
        for (let sIdx = 0; sIdx < 4; sIdx++) {
            const subQs = await prisma.question.findMany({
                where: { subjectId: subjects[sIdx].id },
                take: 5,
                skip: (t - 1) * 2
            });
            testQs.push(...subQs);
        }
        await prisma.test.create({
            data: {
                name: `Final Sprint Mock Test #${t}`,
                examId: exams[0].id,
                questions: {
                    connect: testQs.map(q => ({ id: q.id }))
                }
            }
        });
    }
    await prisma.job.createMany({
        data: [
            { title: 'Assistant Section Officer', description: 'Central Secretariat Service via SSC CGL', deadline: new Date('2026-06-30') },
            { title: 'IAS Trainee', description: 'Foundation course at LBSNAA via UPSC CSE', deadline: new Date('2026-05-15') }
        ]
    });
    await prisma.subscription.createMany({
        data: [
            { title: 'Standard', price: 0, features: ['Daily Quizzes', 'Job Alerts', 'Community Access'] },
            { title: 'Premium', price: 999, features: ['Unlimited Mocks', 'AI Career Roadmap', 'Proctor Analysis'], isRecommended: true },
            { title: 'Elite', price: 2499, features: ['1-on-1 Mentorship', 'Physical Study Material', 'Lifetime Access'] }
        ]
    });
    const categories = await Promise.all([
        prisma.mockTestCategory.create({ data: { name: 'SSC' } }),
        prisma.mockTestCategory.create({ data: { name: 'Banking' } }),
        prisma.mockTestCategory.create({ data: { name: 'UPSC' } }),
        prisma.mockTestCategory.create({ data: { name: 'JEE' } }),
        prisma.mockTestCategory.create({ data: { name: 'Health' } })
    ]);
    console.log('Creating mock tests...');
    await prisma.mockTest.create({
        data: {
            title: 'SSC CGL Full Length Mock - 1',
            duration: 120,
            sectionType: 'Full Length',
            isProctored: true,
            isAdaptive: true,
            categoryId: categories[0].id,
            examId: exams[0].id
        }
    });
    await prisma.mockTest.create({
        data: {
            title: 'SBI PO Prelims - Quantitative Aptitude',
            duration: 20,
            sectionType: 'Sectional',
            isProctored: false,
            isAdaptive: false,
            categoryId: categories[1].id,
            examId: exams[0].id
        }
    });
    await prisma.mockTest.create({
        data: {
            title: 'UPSC GS Paper 1 - Ancient History',
            duration: 60,
            sectionType: 'Topic Wise',
            isProctored: false,
            isAdaptive: true,
            categoryId: categories[2].id,
            examId: exams[1].id
        }
    });
    await prisma.mockTest.create({
        data: {
            title: 'Artha Elite Assessment',
            duration: 60,
            sectionType: 'Intelligence Engine',
            isProctored: true,
            isAdaptive: true,
            categoryId: categories[4].id,
            examId: exams[0].id
        }
    });
    console.log('Creating study plans...');
    const studyPlan = await prisma.studyPlan.create({
        data: {
            userId: testUser.id,
            examId: exams[0].id,
            targetExam: 'SSC CGL 2026',
            examDate: new Date('2026-06-15'),
            currentLevel: 'Intermediate',
            weakAreas: ['Quant', 'General Awareness'],
            dailyStudyHours: 4,
            mockFrequency: 'Weekly',
            revisionStrategy: 'Weekend Revision',
            preferredStudyTimes: 'Morning (6 AM - 10 AM)',
            days: {
                create: [
                    {
                        day: 'Monday',
                        activities: {
                            create: [
                                {
                                    timeSlot: '06:00 - 08:00',
                                    description: 'Quant: Geometry Fundamentals',
                                    focusArea: 'Quant',
                                },
                                {
                                    timeSlot: '08:00 - 09:00',
                                    description: 'English: Grammar Basics',
                                    focusArea: 'English',
                                }
                            ]
                        }
                    },
                    {
                        day: 'Tuesday',
                        activities: {
                            create: [
                                {
                                    timeSlot: '18:00 - 20:00',
                                    description: 'Reasoning: Logical Puzzles',
                                    focusArea: 'Reasoning',
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });
    console.log('Seed completed successfully with Study Plans, 100 questions, 5 tests, and 4 mock tests.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map