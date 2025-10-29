-- CreateEnum
CREATE TYPE "Category" AS ENUM ('STRENGTH', 'CARDIO', 'FLEXIBILITY', 'FUNCTIONAL', 'GENERAL');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('MACHINE', 'FREE_WEIGHT', 'BODYWEIGHT', 'RESISTANCE_BAND');

-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('CHEST', 'BACK', 'SHOULDERS', 'LEGS', 'ARMS', 'CORE', 'FULL_BODY');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'GENERAL',
    "type" "ExerciseType",
    "equipment" TEXT,
    "muscleGroup" "MuscleGroup",
    "difficulty" "Difficulty" DEFAULT 'MEDIUM',
    "instructions" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);
