/*
  Warnings:

  - A unique constraint covering the columns `[publicFileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "publicFileId" INTEGER;

-- CreateTable
CREATE TABLE "PublicFile" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_publicFileId_key" ON "User"("publicFileId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_publicFileId_fkey" FOREIGN KEY ("publicFileId") REFERENCES "PublicFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
