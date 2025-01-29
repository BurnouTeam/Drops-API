/*
  Warnings:

  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Client` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber,organizationId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_clientId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP CONSTRAINT "Client_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("phoneNumber");

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "clientId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "clientId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "Client_organizationId_phoneNumber_idx" ON "Client"("organizationId", "phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Client_phoneNumber_organizationId_key" ON "Client"("phoneNumber", "organizationId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
