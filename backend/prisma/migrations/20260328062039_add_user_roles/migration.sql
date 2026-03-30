/*
  Warnings:

  - A unique constraint covering the columns `[idempotencyKey]` on the table `ArthaAssessment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idempotencyKey]` on the table `MockTestAttempt` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idempotencyKey]` on the table `Result` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_examId_fkey";

-- DropForeignKey
ALTER TABLE "CareerReadinessTestScore" DROP CONSTRAINT "CareerReadinessTestScore_testId_fkey";

-- DropForeignKey
ALTER TABLE "MockTest" DROP CONSTRAINT "MockTest_examId_fkey";

-- DropForeignKey
ALTER TABLE "MockTestAttempt" DROP CONSTRAINT "MockTestAttempt_mockTestId_fkey";

-- DropForeignKey
ALTER TABLE "PYP" DROP CONSTRAINT "PYP_examId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "ReferralReward" DROP CONSTRAINT "ReferralReward_mockTestId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_testId_fkey";

-- DropForeignKey
ALTER TABLE "StudyPlan" DROP CONSTRAINT "StudyPlan_examId_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_examId_fkey";

-- AlterTable
ALTER TABLE "ArthaAssessment" ADD COLUMN     "idempotencyKey" TEXT;

-- AlterTable
ALTER TABLE "MockTestAttempt" ADD COLUMN     "correctAnswers" INTEGER,
ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "subjectBreakdown" JSONB;

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "idempotencyKey" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "TestSubject" (
    "id" SERIAL NOT NULL,
    "testId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "allocatedQuestions" INTEGER NOT NULL,

    CONSTRAINT "TestSubject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TestSubject_testId_idx" ON "TestSubject"("testId");

-- CreateIndex
CREATE INDEX "TestSubject_subjectId_idx" ON "TestSubject"("subjectId");

-- CreateIndex
CREATE INDEX "Application_userId_idx" ON "Application"("userId");

-- CreateIndex
CREATE INDEX "Application_examId_idx" ON "Application"("examId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ArthaAssessment_idempotencyKey_key" ON "ArthaAssessment"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ArthaAssessment_profileId_idx" ON "ArthaAssessment"("profileId");

-- CreateIndex
CREATE INDEX "ArthaAssessment_createdAt_idx" ON "ArthaAssessment"("createdAt");

-- CreateIndex
CREATE INDEX "ArthaProfile_userId_idx" ON "ArthaProfile"("userId");

-- CreateIndex
CREATE INDEX "ArthaProfile_createdAt_idx" ON "ArthaProfile"("createdAt");

-- CreateIndex
CREATE INDEX "ArthaQuestionAttempt_assessmentId_idx" ON "ArthaQuestionAttempt"("assessmentId");

-- CreateIndex
CREATE INDEX "ArthaQuestionAttempt_questionId_idx" ON "ArthaQuestionAttempt"("questionId");

-- CreateIndex
CREATE INDEX "ArthaQuestionAttempt_attemptedAt_idx" ON "ArthaQuestionAttempt"("attemptedAt");

-- CreateIndex
CREATE INDEX "ArthaRecentReport_otrId_idx" ON "ArthaRecentReport"("otrId");

-- CreateIndex
CREATE INDEX "ArthaRecentReport_createdAt_idx" ON "ArthaRecentReport"("createdAt");

-- CreateIndex
CREATE INDEX "CareerReadinessTestScore_otrId_idx" ON "CareerReadinessTestScore"("otrId");

-- CreateIndex
CREATE INDEX "CareerReadinessTestScore_testId_idx" ON "CareerReadinessTestScore"("testId");

-- CreateIndex
CREATE INDEX "CareerReadinessTestScore_createdAt_idx" ON "CareerReadinessTestScore"("createdAt");

-- CreateIndex
CREATE INDEX "Exam_createdAt_idx" ON "Exam"("createdAt");

-- CreateIndex
CREATE INDEX "IntelligenceProfile_userId_idx" ON "IntelligenceProfile"("userId");

-- CreateIndex
CREATE INDEX "IntelligenceProfile_createdAt_idx" ON "IntelligenceProfile"("createdAt");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Job_deadline_idx" ON "Job"("deadline");

-- CreateIndex
CREATE INDEX "Job_createdAt_idx" ON "Job"("createdAt");

-- CreateIndex
CREATE INDEX "MockTest_categoryId_idx" ON "MockTest"("categoryId");

-- CreateIndex
CREATE INDEX "MockTest_examId_idx" ON "MockTest"("examId");

-- CreateIndex
CREATE INDEX "MockTest_createdAt_idx" ON "MockTest"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MockTestAttempt_idempotencyKey_key" ON "MockTestAttempt"("idempotencyKey");

-- CreateIndex
CREATE INDEX "MockTestAttempt_otrId_idx" ON "MockTestAttempt"("otrId");

-- CreateIndex
CREATE INDEX "MockTestAttempt_mockTestId_idx" ON "MockTestAttempt"("mockTestId");

-- CreateIndex
CREATE INDEX "MockTestAttempt_attemptedAt_idx" ON "MockTestAttempt"("attemptedAt");

-- CreateIndex
CREATE INDEX "MockTestAttempt_otrId_mockTestId_idx" ON "MockTestAttempt"("otrId", "mockTestId");

-- CreateIndex
CREATE INDEX "PYP_examId_idx" ON "PYP"("examId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_subscriptionId_idx" ON "Payment"("subscriptionId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- CreateIndex
CREATE INDEX "Question_subjectId_idx" ON "Question"("subjectId");

-- CreateIndex
CREATE INDEX "Referral_referrerId_idx" ON "Referral"("referrerId");

-- CreateIndex
CREATE INDEX "Referral_refereeOtrId_idx" ON "Referral"("refereeOtrId");

-- CreateIndex
CREATE INDEX "Referral_status_idx" ON "Referral"("status");

-- CreateIndex
CREATE INDEX "ReferralReward_userId_idx" ON "ReferralReward"("userId");

-- CreateIndex
CREATE INDEX "ReferralReward_mockTestId_idx" ON "ReferralReward"("mockTestId");

-- CreateIndex
CREATE UNIQUE INDEX "Result_idempotencyKey_key" ON "Result"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Result_userId_idx" ON "Result"("userId");

-- CreateIndex
CREATE INDEX "Result_testId_idx" ON "Result"("testId");

-- CreateIndex
CREATE INDEX "Result_createdAt_idx" ON "Result"("createdAt");

-- CreateIndex
CREATE INDEX "Result_userId_testId_idx" ON "Result"("userId", "testId");

-- CreateIndex
CREATE INDEX "StudyActivity_dayId_idx" ON "StudyActivity"("dayId");

-- CreateIndex
CREATE INDEX "StudyPlan_userId_idx" ON "StudyPlan"("userId");

-- CreateIndex
CREATE INDEX "StudyPlan_examId_idx" ON "StudyPlan"("examId");

-- CreateIndex
CREATE INDEX "StudyPlanDay_planId_idx" ON "StudyPlanDay"("planId");

-- CreateIndex
CREATE INDEX "StudyPlanDay_date_idx" ON "StudyPlanDay"("date");

-- CreateIndex
CREATE INDEX "Test_examId_idx" ON "Test"("examId");

-- CreateIndex
CREATE INDEX "Test_createdAt_idx" ON "Test"("createdAt");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "User_otrId_idx" ON "User"("otrId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSubject" ADD CONSTRAINT "TestSubject_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSubject" ADD CONSTRAINT "TestSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PYP" ADD CONSTRAINT "PYP_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockTest" ADD CONSTRAINT "MockTest_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockTestAttempt" ADD CONSTRAINT "MockTestAttempt_mockTestId_fkey" FOREIGN KEY ("mockTestId") REFERENCES "MockTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerReadinessTestScore" ADD CONSTRAINT "CareerReadinessTestScore_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralReward" ADD CONSTRAINT "ReferralReward_mockTestId_fkey" FOREIGN KEY ("mockTestId") REFERENCES "MockTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyPlan" ADD CONSTRAINT "StudyPlan_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
