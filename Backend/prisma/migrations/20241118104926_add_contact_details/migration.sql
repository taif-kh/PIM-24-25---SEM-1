-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "resumeLink" DROP NOT NULL;
