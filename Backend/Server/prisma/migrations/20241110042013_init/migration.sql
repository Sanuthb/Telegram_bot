-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "channel_name" TEXT,
    "username" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "keywords_detected" TEXT[],

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
