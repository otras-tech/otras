/*
  Warnings:

  - Added the required column `updatedAt` to the `ArthaRecentReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CareerReadinessTestScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MockTestAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PYP` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
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
ALTER TABLE "Admin" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ArthaAssessment" ADD COLUMN     "jobId" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'COMPLETED',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ArthaProfile" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ArthaQuestionAttempt" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ArthaRecentReport" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CareerReadinessTestScore" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "IntelligenceFeedback" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "IntelligenceProfile" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MockTest" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MockTestAttempt" ADD COLUMN     "correctAnswers" INTEGER,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subjectBreakdown" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PYP" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Referral" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ReferralReward" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Roadmap" ADD COLUMN     "jobId" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'COMPLETED',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "StudyActivity" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "StudyPlan" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "StudyPlanDay" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER',
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE INDEX "Admin_username_idx" ON "Admin"("username");

-- CreateIndex
CREATE INDEX "Admin_email_idx" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Application_userId_idx" ON "Application"("userId");

-- CreateIndex
CREATE INDEX "Application_examId_idx" ON "Application"("examId");

-- CreateIndex
CREATE INDEX "Application_createdAt_idx" ON "Application"("createdAt");

-- CreateIndex
CREATE INDEX "Application_userId_examId_idx" ON "Application"("userId", "examId");

-- CreateIndex
CREATE INDEX "Application_examId_status_idx" ON "Application"("examId", "status");

-- CreateIndex
CREATE INDEX "ArthaAssessment_profileId_idx" ON "ArthaAssessment"("profileId");

-- CreateIndex
CREATE INDEX "ArthaAssessment_createdAt_idx" ON "ArthaAssessment"("createdAt");

-- CreateIndex
CREATE INDEX "ArthaProfile_userId_idx" ON "ArthaProfile"("userId");

-- CreateIndex
CREATE INDEX "ArthaQuestionAttempt_assessmentId_idx" ON "ArthaQuestionAttempt"("assessmentId");

-- CreateIndex
CREATE INDEX "ArthaQuestionAttempt_questionId_idx" ON "ArthaQuestionAttempt"("questionId");

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
CREATE INDEX "CareerReadinessTestScore_otrId_testId_idx" ON "CareerReadinessTestScore"("otrId", "testId");

-- CreateIndex
CREATE INDEX "Exam_name_idx" ON "Exam"("name");

-- CreateIndex
CREATE INDEX "Exam_createdAt_idx" ON "Exam"("createdAt");

-- CreateIndex
CREATE INDEX "Exam_isDeleted_createdAt_idx" ON "Exam"("isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "IntelligenceProfile_userId_idx" ON "IntelligenceProfile"("userId");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Job_createdAt_idx" ON "Job"("createdAt");

-- CreateIndex
CREATE INDEX "MockTest_examId_idx" ON "MockTest"("examId");

-- CreateIndex
CREATE INDEX "MockTest_categoryId_idx" ON "MockTest"("categoryId");

-- CreateIndex
CREATE INDEX "MockTest_createdAt_idx" ON "MockTest"("createdAt");

-- CreateIndex
CREATE INDEX "MockTestAttempt_otrId_idx" ON "MockTestAttempt"("otrId");

-- CreateIndex
CREATE INDEX "MockTestAttempt_mockTestId_idx" ON "MockTestAttempt"("mockTestId");

-- CreateIndex
CREATE INDEX "MockTestAttempt_attemptedAt_idx" ON "MockTestAttempt"("attemptedAt");

-- CreateIndex
CREATE INDEX "MockTestAttempt_otrId_attemptedAt_idx" ON "MockTestAttempt"("otrId", "attemptedAt");

-- CreateIndex
CREATE INDEX "MockTestAttempt_mockTestId_attemptedAt_idx" ON "MockTestAttempt"("mockTestId", "attemptedAt");

-- CreateIndex
CREATE INDEX "MockTestAttempt_otrId_isDeleted_attemptedAt_idx" ON "MockTestAttempt"("otrId", "isDeleted", "attemptedAt");

-- CreateIndex
CREATE INDEX "PYP_examId_idx" ON "PYP"("examId");

-- CreateIndex
CREATE INDEX "PYP_year_idx" ON "PYP"("year");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_subscriptionId_idx" ON "Payment"("subscriptionId");

-- CreateIndex
CREATE INDEX "Payment_razorpayOrderId_idx" ON "Payment"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- CreateIndex
CREATE INDEX "Question_subjectId_idx" ON "Question"("subjectId");

-- CreateIndex
CREATE INDEX "Question_createdAt_idx" ON "Question"("createdAt");

-- CreateIndex
CREATE INDEX "Referral_referrerId_idx" ON "Referral"("referrerId");

-- CreateIndex
CREATE INDEX "Referral_refereeOtrId_idx" ON "Referral"("refereeOtrId");

-- CreateIndex
CREATE INDEX "Referral_createdAt_idx" ON "Referral"("createdAt");

-- CreateIndex
CREATE INDEX "ReferralReward_userId_idx" ON "ReferralReward"("userId");

-- CreateIndex
CREATE INDEX "ReferralReward_mockTestId_idx" ON "ReferralReward"("mockTestId");

-- CreateIndex
CREATE INDEX "Result_userId_idx" ON "Result"("userId");

-- CreateIndex
CREATE INDEX "Result_testId_idx" ON "Result"("testId");

-- CreateIndex
CREATE INDEX "Result_createdAt_idx" ON "Result"("createdAt");

-- CreateIndex
CREATE INDEX "Result_userId_createdAt_idx" ON "Result"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Result_testId_createdAt_idx" ON "Result"("testId", "createdAt");

-- CreateIndex
CREATE INDEX "Result_isDeleted_createdAt_idx" ON "Result"("isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "StudyActivity_dayId_idx" ON "StudyActivity"("dayId");

-- CreateIndex
CREATE INDEX "StudyPlan_userId_idx" ON "StudyPlan"("userId");

-- CreateIndex
CREATE INDEX "StudyPlan_examId_idx" ON "StudyPlan"("examId");

-- CreateIndex
CREATE INDEX "StudyPlanDay_planId_idx" ON "StudyPlanDay"("planId");

-- CreateIndex
CREATE INDEX "Subject_name_idx" ON "Subject"("name");

-- CreateIndex
CREATE INDEX "Subscription_createdAt_idx" ON "Subscription"("createdAt");

-- CreateIndex
CREATE INDEX "Test_examId_idx" ON "Test"("examId");

-- CreateIndex
CREATE INDEX "Test_createdAt_idx" ON "Test"("createdAt");

-- CreateIndex
CREATE INDEX "Test_isDeleted_createdAt_idx" ON "Test"("isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_otrId_idx" ON "User"("otrId");

-- CreateIndex
CREATE INDEX "User_referralCode_idx" ON "User"("referralCode");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_role_isDeleted_idx" ON "User"("role", "isDeleted");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
