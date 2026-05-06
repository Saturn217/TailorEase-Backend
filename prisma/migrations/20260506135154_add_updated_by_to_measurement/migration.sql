-- AlterTable
ALTER TABLE "Measurement" ADD COLUMN     "updatedBy" TEXT;

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
