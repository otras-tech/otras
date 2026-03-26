-- AlterTable
ALTER TABLE "ArthaProfile" ALTER COLUMN "logicalScore" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "quantScore" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "verbalScore" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "IntelligenceFeedback" ADD COLUMN     "accuracyInsight" TEXT,
ADD COLUMN     "consistencyInsight" TEXT,
ADD COLUMN     "preparationAdvice" TEXT,
ADD COLUMN     "speedInsight" TEXT,
ADD COLUMN     "subjectStrength" TEXT,
ADD COLUMN     "tier" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "weakAreas" TEXT,
ALTER COLUMN "logicalFoundation" DROP NOT NULL,
ALTER COLUMN "subjectDepth" DROP NOT NULL,
ALTER COLUMN "readinessInsight" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MockTestAttempt" ADD COLUMN     "startTime" TIMESTAMP(3),
ADD COLUMN     "submitTime" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "startTime" TIMESTAMP(3),
ADD COLUMN     "submitTime" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ArthaAssessment" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "exam" TEXT,
    "logicalScore" DOUBLE PRECISION,
    "quantScore" DOUBLE PRECISION,
    "verbalScore" DOUBLE PRECISION,
    "subjectScores" JSONB,
    "accuracy" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "consistency" DOUBLE PRECISION,
    "percentile" DOUBLE PRECISION,
    "startTime" TIMESTAMP(3),
    "submitTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArthaAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArthaQuestionAttempt" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "selectedOption" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "timeTaken" INTEGER NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArthaQuestionAttempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArthaAssessment" ADD CONSTRAINT "ArthaAssessment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ArthaProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArthaQuestionAttempt" ADD CONSTRAINT "ArthaQuestionAttempt_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "ArthaAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
