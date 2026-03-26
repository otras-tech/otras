-- AlterTable
ALTER TABLE "ArthaAssessment" ADD COLUMN     "score" DOUBLE PRECISION,
ADD COLUMN     "totalMarks" INTEGER;

-- AlterTable
ALTER TABLE "StudyPlanDay" ADD COLUMN     "date" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ArthaRecentReport" (
    "id" TEXT NOT NULL,
    "otrId" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "consistency" DOUBLE PRECISION,
    "readinessIndex" DOUBLE PRECISION,
    "percentile" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subjectBreakdown" JSONB,

    CONSTRAINT "ArthaRecentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntelligenceProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "logicalScore" INTEGER NOT NULL,
    "quantScore" INTEGER NOT NULL,
    "verbalScore" INTEGER NOT NULL,
    "interests" TEXT[],
    "learningPattern" TEXT NOT NULL,
    "confidenceIndex" INTEGER NOT NULL,
    "aspirations" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntelligenceProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "recommendations" TEXT[],
    "phase1" TEXT NOT NULL,
    "phase2" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArthaRecentReport_otrId_tier_key" ON "ArthaRecentReport"("otrId", "tier");

-- CreateIndex
CREATE UNIQUE INDEX "Roadmap_profileId_key" ON "Roadmap"("profileId");

-- AddForeignKey
ALTER TABLE "ArthaRecentReport" ADD CONSTRAINT "ArthaRecentReport_otrId_fkey" FOREIGN KEY ("otrId") REFERENCES "User"("otrId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "IntelligenceProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
