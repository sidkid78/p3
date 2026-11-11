/*
  Warnings:

  - You are about to drop the column `assignedAgents` on the `PlanStep` table. All the data in the column will be lost.
  - Added the required column `agentName` to the `PlanStep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlanStep" DROP COLUMN "assignedAgents",
ADD COLUMN     "agentName" TEXT NOT NULL,
ADD COLUMN     "agentSpecialization" TEXT[],
ADD COLUMN     "modelPreference" TEXT NOT NULL DEFAULT 'gemini-3.5-flash';
