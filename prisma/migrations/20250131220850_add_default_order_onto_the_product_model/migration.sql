/*
  Warnings:

  - A unique constraint covering the columns `[defaultOrderId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "defaultOrderId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Client_defaultOrderId_key" ON "Client"("defaultOrderId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_defaultOrderId_fkey" FOREIGN KEY ("defaultOrderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
