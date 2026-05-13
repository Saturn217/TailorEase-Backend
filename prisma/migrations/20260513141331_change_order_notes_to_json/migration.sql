/*
  Warnings:

  - Added the required column `notes` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "notes",
ADD COLUMN     "notes" JSONB NOT NULL;
