-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ALTER COLUMN "keywords_detected" SET DEFAULT ARRAY[]::TEXT[];
