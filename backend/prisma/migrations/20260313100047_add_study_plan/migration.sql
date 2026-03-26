/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
ALTER COLUMN "referralCode" DROP DEFAULT;

-- CreateTable
CREATE TABLE "StudyPlan" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "examId" INTEGER,
    "targetExam" TEXT NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "tier1Score" INTEGER,
    "tier2Score" INTEGER,
    "currentLevel" TEXT NOT NULL,
    "weakAreas" TEXT[],
    "dailyStudyHours" INTEGER NOT NULL,
    "mockFrequency" TEXT NOT NULL,
    "revisionStrategy" TEXT NOT NULL,
    "preferredStudyTimes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyPlanDay" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "planId" TEXT NOT NULL,

    CONSTRAINT "StudyPlanDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyActivity" (
    "id" TEXT NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "focusArea" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "missed" BOOLEAN NOT NULL DEFAULT false,
    "dayId" TEXT NOT NULL,

    CONSTRAINT "StudyActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- AddForeignKey
ALTER TABLE "StudyPlan" ADD CONSTRAINT "StudyPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyPlan" ADD CONSTRAINT "StudyPlan_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyPlanDay" ADD CONSTRAINT "StudyPlanDay_planId_fkey" FOREIGN KEY ("planId") REFERENCES "StudyPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyActivity" ADD CONSTRAINT "StudyActivity_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "StudyPlanDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
