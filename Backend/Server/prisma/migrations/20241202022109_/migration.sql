-- CreateTable
CREATE TABLE "Loginuser" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Loginuser_pkey" PRIMARY KEY ("id")
);
