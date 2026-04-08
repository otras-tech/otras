/**
 * ============================================================================
 *  OTRAS — Production-Grade Exam Seed Script
 * ============================================================================
 *
 *  Purpose : Populate the "Exam" table with 10,000+ realistic rows for
 *            scalability / load-testing (k6).
 *
 *  ORM     : Prisma (detected from project)
 *  Strategy: Bulk insert via createMany in 1,000-row batches
 *  Safety  : TRUNCATE CASCADE before insert — idempotent & safe to re-run
 *
 *  Run     : npx ts-node scripts/seed-exams-bulk.ts
 * ============================================================================
 */

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

// ─── Configuration ──────────────────────────────────────────────────────────

const TOTAL_ROWS  = 10_000;
const BATCH_SIZE  = 1_000;

// ─── Realistic Data Pools ───────────────────────────────────────────────────

const CATEGORIES = ['UPSC', 'SSC', 'Banking', 'Railways', 'State Exams'] as const;

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

const PATTERNS = [
  'MCQ',
  'Descriptive',
  'MCQ + Descriptive',
  'Computer Based Test',
  'Pen & Paper',
  'Online Adaptive',
] as const;

const ELIGIBILITY_OPTIONS = [
  "Bachelor's Degree from recognized university",
  'Graduate in any discipline',
  '12th Pass with 60% marks',
  'Post Graduate Degree',
  'Engineering Degree (B.E./B.Tech)',
  'Diploma holders eligible',
  'Graduate with minimum 55% marks',
  'Any Graduate / Post Graduate',
] as const;

/** Realistic exam name templates grouped by category */
const EXAM_NAME_TEMPLATES: Record<typeof CATEGORIES[number], string[]> = {
  UPSC: [
    'UPSC Prelims {YEAR}',
    'UPSC Mains GS Paper {PAPER} {YEAR}',
    'UPSC CSAT {YEAR}',
    'UPSC CAPF AC {YEAR}',
    'UPSC IES/ISS {YEAR}',
    'UPSC NDA {SEASON} {YEAR}',
    'UPSC CDS {SEASON} {YEAR}',
    'UPSC EPFO EO/AO {YEAR}',
    'UPSC Civil Services {YEAR}',
    'UPSC Indian Forest Service {YEAR}',
  ],
  SSC: [
    'SSC CGL Tier {TIER} {YEAR}',
    'SSC CHSL Tier {TIER} {YEAR}',
    'SSC MTS {YEAR}',
    'SSC GD Constable {YEAR}',
    'SSC CPO {YEAR}',
    'SSC Stenographer Grade C & D {YEAR}',
    'SSC JE {DISCIPLINE} {YEAR}',
    'SSC Selection Post Phase {PHASE} {YEAR}',
    'SSC Scientific Assistant {YEAR}',
    'SSC Head Constable {YEAR}',
  ],
  Banking: [
    'SBI PO Prelims {YEAR}',
    'SBI Clerk Mains {YEAR}',
    'IBPS PO Prelims {YEAR}',
    'IBPS Clerk Mains {YEAR}',
    'IBPS RRB Officer Scale {SCALE} {YEAR}',
    'RBI Grade B Phase {PHASE} {YEAR}',
    'RBI Assistant {YEAR}',
    'NABARD Grade A {YEAR}',
    'SEBI Grade A Phase {PHASE} {YEAR}',
    'LIC AAO {YEAR}',
  ],
  Railways: [
    'RRB NTPC CBT {TIER} {YEAR}',
    'RRB Group D {YEAR}',
    'RRB ALP Technician Stage {TIER} {YEAR}',
    'RRB JE CBT {TIER} {YEAR}',
    'RRB Paramedical {YEAR}',
    'RRB Ministerial & Isolated {YEAR}',
    'RRB NTPC Graduate Level {YEAR}',
    'RRB Senior Section Engineer {YEAR}',
    'RPF Constable {YEAR}',
    'RPF SI {YEAR}',
  ],
  'State Exams': [
    'UPPSC PCS Prelims {YEAR}',
    'MPPSC State Service {YEAR}',
    'BPSC {NTH} CCE Prelims {YEAR}',
    'RPSC RAS Prelims {YEAR}',
    'KPSC KAS Prelims {YEAR}',
    'WBPSC WBCS Prelims {YEAR}',
    'TNPSC Group {GROUP} {YEAR}',
    'APPSC Group {GROUP} {YEAR}',
    'TSPSC Group {GROUP} {YEAR}',
    'GPSC Class {CLASS} {YEAR}',
  ],
};

const SYLLABUS_POOL = [
  'Quantitative Aptitude, Logical Reasoning, English Comprehension, General Awareness',
  'General Studies, Indian History, Indian Polity, Geography, Economics, Science & Tech',
  'Reasoning Ability, Quantitative Aptitude, English Language, Computer Knowledge, Banking Awareness',
  'Mathematics, General Intelligence, General Science, General Awareness & Current Affairs',
  'Indian Polity & Governance, History & Culture, Geography & Environment, Economy, CSAT',
  'Physics, Chemistry, Mathematics, Engineering Drawing',
  'General Knowledge, Elementary Mathematics, Analytical Ability, English/Hindi',
  'Current Affairs, Static GK, Data Interpretation, Verbal & Non-Verbal Reasoning',
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildExamName(category: typeof CATEGORIES[number]): string {
  let template = pick(EXAM_NAME_TEMPLATES[category]);

  const year = faker.helpers.arrayElement([2024, 2025, 2026]);
  template = template.replace('{YEAR}', String(year));
  template = template.replace('{PAPER}', String(faker.number.int({ min: 1, max: 4 })));
  template = template.replace('{TIER}', String(faker.number.int({ min: 1, max: 3 })));
  template = template.replace('{SEASON}', pick(['I', 'II']));
  template = template.replace('{PHASE}', String(faker.number.int({ min: 1, max: 12 })));
  template = template.replace('{SCALE}', String(faker.number.int({ min: 1, max: 3 })));
  template = template.replace('{NTH}', `${faker.number.int({ min: 60, max: 70 })}th`);
  template = template.replace('{DISCIPLINE}', pick(['Civil', 'Mechanical', 'Electrical', 'Electronics']));
  template = template.replace('{GROUP}', String(faker.number.int({ min: 1, max: 4 })));
  template = template.replace('{CLASS}', String(faker.number.int({ min: 1, max: 3 })));

  return template;
}

function buildDescription(name: string, category: string, difficulty: string): string {
  const snippets = [
    `A comprehensive ${difficulty.toLowerCase()}-level examination under the ${category} category.`,
    `This exam tests candidates on core competencies required for government service positions.`,
    `Designed to evaluate analytical thinking, domain knowledge, and problem-solving skills.`,
    `Conducted annually for recruitment across various departments and organizations.`,
    `Includes rigorous sections on general studies, quantitative ability, and reasoning.`,
  ];
  const base = `${name} — ${pick(snippets)} ${faker.lorem.sentence({ min: 8, max: 15 })}`;
  return base;
}

function randomRecentDate(daysBack: number): Date {
  const now = Date.now();
  const offset = Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000);
  return new Date(now - offset);
}

// ─── Main Seed Logic ────────────────────────────────────────────────────────

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║        OTRAS — Bulk Exam Seed (10,000 rows)             ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');

    // ── Step 1: Truncate existing exam data (CASCADE handles FKs) ──────
    console.log('⏳  Truncating "Exam" table (CASCADE)...');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Exam" CASCADE');
    console.log('✅  Table truncated.\n');

    // ── Step 2: Generate all rows in memory ────────────────────────────
    console.log(`⏳  Generating ${TOTAL_ROWS.toLocaleString()} exam records...`);
    const startGen = performance.now();

    const rows: {
      name: string;
      shortDescription: string;
      longDescription: string;
      cutoff: number;
      syllabus: string;
      eligibility: string;
      pattern: string;
      noOfQuestions: number;
      applicationStatus: string;
      isDeleted: boolean;
      createdAt: Date;
      updatedAt: Date;
    }[] = [];

    for (let i = 0; i < TOTAL_ROWS; i++) {
      const category = pick(CATEGORIES);
      const difficulty = pick(DIFFICULTIES);
      const name = buildExamName(category);
      const createdAt = randomRecentDate(365); // within last 1 year
      const updatedAt = new Date(
        createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime()),
      );

      rows.push({
        name: `${name} #${i + 1}`,                           // unique suffix prevents collisions
        shortDescription: `${category} | ${difficulty}`,
        longDescription: buildDescription(name, category, difficulty),
        cutoff: parseFloat((Math.random() * 200 + 50).toFixed(2)),
        syllabus: pick(SYLLABUS_POOL),
        eligibility: pick(ELIGIBILITY_OPTIONS),
        pattern: pick(PATTERNS),
        noOfQuestions: faker.number.int({ min: 50, max: 200 }),
        applicationStatus: 'Application Success',
        isDeleted: false,
        createdAt,
        updatedAt,
      });
    }

    const genMs = (performance.now() - startGen).toFixed(0);
    console.log(`✅  Generated in ${genMs}ms.\n`);

    // ── Step 3: Batch insert ───────────────────────────────────────────
    const totalBatches = Math.ceil(rows.length / BATCH_SIZE);
    console.log(
      `⏳  Inserting in ${totalBatches} batches of ${BATCH_SIZE.toLocaleString()} rows...`,
    );
    const startInsert = performance.now();

    for (let b = 0; b < totalBatches; b++) {
      const chunk = rows.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
      const result = await prisma.exam.createMany({
        data: chunk,
        skipDuplicates: true,
      });
      const pct = (((b + 1) / totalBatches) * 100).toFixed(0);
      process.stdout.write(
        `\r   Batch ${b + 1}/${totalBatches} — ${result.count} rows inserted (${pct}%)`,
      );
    }

    const insertMs = (performance.now() - startInsert).toFixed(0);
    console.log(`\n✅  All rows inserted in ${insertMs}ms.\n`);

    // ── Step 4: Verify ─────────────────────────────────────────────────
    const count = await prisma.exam.count();
    console.log(`📊  Final row count in "Exam" table: ${count.toLocaleString()}`);
    console.log('');
    console.log('🎉  Seed completed successfully!');
    console.log('');
  } catch (error) {
    console.error('\n❌  Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
