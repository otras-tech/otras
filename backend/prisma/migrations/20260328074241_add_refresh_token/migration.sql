-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT;
