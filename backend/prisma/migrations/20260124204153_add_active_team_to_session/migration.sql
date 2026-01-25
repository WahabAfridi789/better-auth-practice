-- AlterTable
ALTER TABLE "session" ADD COLUMN     "activeTeamId" TEXT;

-- CreateIndex
CREATE INDEX "session_activeTeamId_idx" ON "session"("activeTeamId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_activeTeamId_fkey" FOREIGN KEY ("activeTeamId") REFERENCES "team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
