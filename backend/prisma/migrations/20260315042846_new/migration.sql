/*
  Warnings:

  - Added the required column `readinessInsight` to the `IntelligenceFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IntelligenceFeedback" ADD COLUMN     "readinessInsight" TEXT NOT NULL;
