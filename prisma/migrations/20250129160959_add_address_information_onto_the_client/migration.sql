/*
  Warnings:

  - Added the required column `cep` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'Brasil',
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;
