-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_defaultOrderId_fkey";

-- CreateTable
CREATE TABLE "DefaultOrder" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT,

    CONSTRAINT "DefaultOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultOrderItem" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "DefaultOrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_defaultOrderId_fkey" FOREIGN KEY ("defaultOrderId") REFERENCES "DefaultOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultOrderItem" ADD CONSTRAINT "DefaultOrderItem_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "DefaultOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultOrderItem" ADD CONSTRAINT "DefaultOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
