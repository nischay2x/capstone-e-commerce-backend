/*
  Warnings:

  - You are about to drop the column `orderDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentInfo` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `_CartItemToOrder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `items` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductState" AS ENUM ('ACTIVE', 'DELETED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'UPI', 'CARD', 'ONLINE');

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'DISPATCHED';

-- DropForeignKey
ALTER TABLE "_CartItemToOrder" DROP CONSTRAINT "_CartItemToOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_CartItemToOrder" DROP CONSTRAINT "_CartItemToOrder_B_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderDate",
DROP COLUMN "paymentInfo",
ADD COLUMN     "items" TEXT NOT NULL,
ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL DEFAULT 'CASH',
ADD COLUMN     "sellerId" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "state" "ProductState" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT;

-- DropTable
DROP TABLE "_CartItemToOrder";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
