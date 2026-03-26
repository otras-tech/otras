// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting comprehensive seed...');

  // 1. Cleanup
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

  // 1.5 Create a Test User
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

  // 2. Create Subjects
  const subjectNames = ['quant', 'logical', 'verbal', 'General Awareness', 'Technical Aptitude'];
  const subjects: any[] = [];
  for (const name of subjectNames) {
    const s = await prisma.subject.create({ data: { name } });
    subjects.push(s);
  }

  // 3. Create Exams
  const exams: any[] = await Promise.all([
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

  // 4. Create 100 Questions (20 per subject)
  // 4. Create 100 Questions (Logical 30, Verbal 30, Quant 40)

  const quantSubject = subjects.find(s => s.name === 'quant');
  const logicalSubject = subjects.find(s => s.name === 'logical');
  const verbalSubject = subjects.find(s => s.name === 'verbal');

  // 40 Quant Questions
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

  // 30 Logical Questions
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

  // 30 Verbal Questions
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

  // 5. Create 5 Random Tests (Linked to SSC as an example)
  for (let t = 1; t <= 5; t++) {
    // Pick 5 questions from each of the first 4 subjects for a 20-question mock test
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

  // 6. Create Jobs
  await prisma.job.createMany({
    data: [
      { title: 'Assistant Section Officer', description: 'Central Secretariat Service via SSC CGL', deadline: new Date('2026-06-30') },
      { title: 'IAS Trainee', description: 'Foundation course at LBSNAA via UPSC CSE', deadline: new Date('2026-05-15') }
    ]
  });

  // 7. Create Subscriptions
  await prisma.subscription.createMany({
    data: [
      { title: 'Standard', price: 0, features: ['Daily Quizzes', 'Job Alerts', 'Community Access'] },
      { title: 'Premium', price: 999, features: ['Unlimited Mocks', 'AI Career Roadmap', 'Proctor Analysis'], isRecommended: true },
      { title: 'Elite', price: 2499, features: ['1-on-1 Mentorship', 'Physical Study Material', 'Lifetime Access'] }
    ]
  });

  // 8. Create Mock Test Categories
  const categories = await Promise.all([
    prisma.mockTestCategory.create({ data: { name: 'SSC' } }),
    prisma.mockTestCategory.create({ data: { name: 'Banking' } }),
    prisma.mockTestCategory.create({ data: { name: 'UPSC' } }),
    prisma.mockTestCategory.create({ data: { name: 'JEE' } }),
    prisma.mockTestCategory.create({ data: { name: 'Health' } })
  ]);

  // 9. Create Mock Tests
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
      examId: exams[0].id // Link to SSC for now as a fallback or if no Banking exam exists
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

  // 10. Create Study Plans
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
