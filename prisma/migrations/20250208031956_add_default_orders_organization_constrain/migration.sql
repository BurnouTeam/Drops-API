/*
  Warnings:

  - Added the required column `organizationId` to the `DefaultOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DefaultOrder" ADD COLUMN     "organizationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DefaultOrder" ADD CONSTRAINT "DefaultOrder_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
