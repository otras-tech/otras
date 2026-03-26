-- CreateTable
CREATE TABLE "MockTestCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MockTestCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockTest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "sectionType" TEXT NOT NULL,
    "isProctored" BOOLEAN NOT NULL DEFAULT false,
    "isAdaptive" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" INTEGER NOT NULL,
    "examId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MockTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockTestAttempt" (
    "id" SERIAL NOT NULL,
    "otrId" TEXT NOT NULL,
    "mockTestId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "totalMarks" DOUBLE PRECISION NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MockTestAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerReadinessTestScore" (
    "id" SERIAL NOT NULL,
    "otrId" TEXT NOT NULL,
    "testId" INTEGER NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "totalMarks" DOUBLE PRECISION NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "wrongAnswers" INTEGER NOT NULL,
    "negativeMarks" DOUBLE PRECISION NOT NULL,
    "subjectBreakdown" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerReadinessTestScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MockTestCategory_name_key" ON "MockTestCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CareerReadinessTestScore_otrId_testId_key" ON "CareerReadinessTestScore"("otrId", "testId");

-- AddForeignKey
ALTER TABLE "MockTest" ADD CONSTRAINT "MockTest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MockTestCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockTest" ADD CONSTRAINT "MockTest_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockTestAttempt" ADD CONSTRAINT "MockTestAttempt_otrId_fkey" FOREIGN KEY ("otrId") REFERENCES "User"("otrId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockTestAttempt" ADD CONSTRAINT "MockTestAttempt_mockTestId_fkey" FOREIGN KEY ("mockTestId") REFERENCES "MockTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerReadinessTestScore" ADD CONSTRAINT "CareerReadinessTestScore_otrId_fkey" FOREIGN KEY ("otrId") REFERENCES "User"("otrId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerReadinessTestScore" ADD CONSTRAINT "CareerReadinessTestScore_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
