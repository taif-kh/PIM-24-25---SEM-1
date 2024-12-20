/*
  Warnings:

  - You are about to drop the column `contactEmail` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "contactEmail",
DROP COLUMN "fullName",
DROP COLUMN "phoneNumber",
ADD COLUMN     "predField" TEXT,
ADD COLUMN     "recJob" TEXT;
