/*
  Warnings:

  - Added the required column `uploadedBy` to the `OrderPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderPhoto" ADD COLUMN     "uploadedBy" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderPhoto" ADD CONSTRAINT "OrderPhoto_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
