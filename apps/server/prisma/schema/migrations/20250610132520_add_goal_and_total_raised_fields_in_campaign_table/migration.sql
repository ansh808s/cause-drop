/*
  Warnings:

  - Added the required column `goal` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_raised` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "goal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_raised" DOUBLE PRECISION NOT NULL;
