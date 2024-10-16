/*
  Warnings:

  - You are about to drop the column `taskOrder` on the `Column` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Column" DROP COLUMN "taskOrder",
ADD COLUMN     "position" TEXT NOT NULL DEFAULT 'a';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "position" TEXT NOT NULL DEFAULT 'a';
