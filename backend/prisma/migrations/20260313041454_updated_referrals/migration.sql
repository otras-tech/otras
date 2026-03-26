/*
  Warnings:

  - You are about to drop the column `subscriptionEnd` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionStart` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionStatus` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "subscriptionEnd",
DROP COLUMN "subscriptionId",
DROP COLUMN "subscriptionStart",
DROP COLUMN "subscriptionStatus";
