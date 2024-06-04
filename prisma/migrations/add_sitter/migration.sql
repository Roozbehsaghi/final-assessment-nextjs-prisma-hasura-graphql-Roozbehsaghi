-- CreateTable
CREATE TABLE "sitters" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "city" TEXT,
    "rate" INTEGER,
    "booking" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sitters_pkey" PRIMARY KEY ("id")
);


