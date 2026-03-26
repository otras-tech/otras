-- AlterTable
ALTER TABLE "ArthaAssessment" ADD COLUMN     "readinessIndex" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ArthaProfile" ADD COLUMN     "readinessIndex" DOUBLE PRECISION NOT NULL DEFAULT 0;
