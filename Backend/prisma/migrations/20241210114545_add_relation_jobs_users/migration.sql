/*
  Warnings:

  - The `postedBy` column on the `Jobs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "postedBy",
ADD COLUMN     "postedBy" INTEGER;

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_postedBy_fkey" FOREIGN KEY ("postedBy") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
