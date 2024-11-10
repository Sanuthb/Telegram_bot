/*
  Warnings:

  - Made the column `channel_name` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "chat_id" SET DATA TYPE BIGINT,
ALTER COLUMN "channel_name" SET NOT NULL,
ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMP(3);
