/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Loginuser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Loginuser_username_key" ON "Loginuser"("username");
