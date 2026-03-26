/*
  Warnings:

  - You are about to drop the column `description` on the `Exam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "description",
ADD COLUMN     "eligibility" TEXT,
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "noOfQuestions" INTEGER,
ADD COLUMN     "pattern" TEXT,
ADD COLUMN     "shortDescription" TEXT;

-- CreateTable
CREATE TABLE "PYP" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "examId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PYP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "features" TEXT[],
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Applied',
    "applicationStatus" TEXT NOT NULL DEFAULT 'Success',
    "admitCardStatus" TEXT NOT NULL DEFAULT 'Pending',
    "examKeyStatus" TEXT NOT NULL DEFAULT 'Pending',
    "resultStatus" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_userId_examId_key" ON "Application"("userId", "examId");

-- AddForeignKey
ALTER TABLE "PYP" ADD CONSTRAINT "PYP_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
