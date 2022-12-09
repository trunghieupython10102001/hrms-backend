/*
  Warnings:

  - Added the required column `functionLink` to the `Function` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Function" ADD COLUMN     "functionLink" TEXT NOT NULL;
