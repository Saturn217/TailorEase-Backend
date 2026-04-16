/*
  Warnings:

  - You are about to drop the column `name` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `ownerName` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Staff` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerFullname` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "name",
DROP COLUMN "ownerName",
DROP COLUMN "profileImage",
ADD COLUMN     "companyImage" TEXT,
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "ownerFullname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "name",
ADD COLUMN     "fullName" TEXT NOT NULL;
