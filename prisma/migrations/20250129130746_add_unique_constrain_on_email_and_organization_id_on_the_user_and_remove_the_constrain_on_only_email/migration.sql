/*
  Warnings:

  - A unique constraint covering the columns `[email,organizationId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- CreateIndex
CREATE INDEX "User_organizationId_email_idx" ON "User"("organizationId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_organizationId_key" ON "User"("email", "organizationId");
