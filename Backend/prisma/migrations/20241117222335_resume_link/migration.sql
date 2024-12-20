/*
  Warnings:

  - Added the required column `resumeLink` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "resumeLink" TEXT NOT NULL;
