-- CreateTable
CREATE TABLE "ArthaProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "otrCompleted" BOOLEAN NOT NULL DEFAULT false,
    "logicalScore" INTEGER NOT NULL,
    "quantScore" INTEGER NOT NULL,
    "verbalScore" INTEGER NOT NULL,
    "percentile" DOUBLE PRECISION NOT NULL,
    "tier1Progress" DOUBLE PRECISION NOT NULL,
    "tier2Progress" DOUBLE PRECISION NOT NULL,
    "tier3Progress" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArthaProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntelligenceFeedback" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "logicalFoundation" TEXT NOT NULL,
    "subjectDepth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntelligenceFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IntelligenceFeedback_profileId_key" ON "IntelligenceFeedback"("profileId");

-- AddForeignKey
ALTER TABLE "IntelligenceFeedback" ADD CONSTRAINT "IntelligenceFeedback_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ArthaProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
