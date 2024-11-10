/*
  Warnings:

  - Added the required column `groupname` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "groupname" TEXT NOT NULL,
ADD COLUMN     "user_id" BIGINT NOT NULL;
