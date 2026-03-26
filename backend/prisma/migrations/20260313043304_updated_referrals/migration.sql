-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'razorpay';

-- AlterTable
ALTER TABLE "Referral" ADD COLUMN     "creditsEarned" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 0;
