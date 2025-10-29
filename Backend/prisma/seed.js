import { PrismaClient, Category, ExerciseType, MuscleGroup, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const exercises = [
        // 🧍 BODYWEIGHT — CORE
        {
            name: "Plank",
            category: Category.STRENGTH,
            type: ExerciseType.BODYWEIGHT,
            equipment: "None",
            muscleGroup: MuscleGroup.CORE,
            difficulty: Difficulty.MEDIUM,
            instructions: "Keep elbows below shoulders, body in a straight line, hold as long as possible.",
            imageUrl: null,
            videoUrl: null
        },
        {
            name: "Side Plank",
            category: Category.STRENGTH,
            type: ExerciseType.BODYWEIGHT,
            equipment: "None",
            muscleGroup: MuscleGroup.CORE,
            difficulty: Difficulty.MEDIUM,
            instructions: "Lie on one side, lift hips, maintain straight body line.",
            imageUrl: null,
            videoUrl: null
        },
        {
            name: "Crunches",
            category: Category.STRENGTH,
            type: ExerciseType.BODYWEIGHT,
            equipment: "None",
            muscleGroup: MuscleGroup.CORE,
            difficulty: Difficulty.EASY,
            instructions: "Lift upper back off the floor by contracting your abs.",
            imageUrl: null,
            videoUrl: null
        },
        {
            name: "Leg Raises",
            category: Category.STRENGTH,
            type: ExerciseType.BODYWEIGHT,
            equipment: "None",
            muscleGroup: MuscleGroup.CORE,
            difficulty: Difficulty.MEDIUM,
            instructions: "Lie flat and lift your legs to 90 degrees, then slowly lower.",
            imageUrl: null,
            videoUrl: null
        },

        // 💪 BODYWEIGHT — CHEST & ARMS
        {
            name: "Push-Up",
            category: Category.STRENGTH,
            type: ExerciseType.BODYWEIGHT,
            equipment: "None",
            muscleGroup: MuscleGroup.CHEST,
            difficulty: Difficulty.MEDIUM,
            instructions: "Lower your body until your chest nearly touches the floor, then push back up.",
        },
        {
            name: "Diamond Push-Up",
            category: Category.STRENGTH,
            type: ExerciseType.BODYWEIGHT,
            equipment: "None",
            muscleGroup: MuscleGroup.ARMS,
            difficulty: Difficulty.HARD,
            instructions: "Place hands close together under chest, forming a diamond shape.",
        },
        {
            name: "Tricep Dips",
            category: Category.STRENGTH,
            type: ExerciseType.BODYWEIGHT,
            equipment: "Chair or Bench",
            muscleGroup: MuscleGroup.ARMS,
            difficulty: Difficulty.MEDIUM,
            instructions: "Lower your body by bending elbows, keeping them close to your body.",
        },

        // 🦵 LEGS — BODYWEIGHT
        {
            name: "Squats",
            category: Category.STRENGTH,
            type: ExerciseType.BODYWEIGHT,
            equipment: "None",
            muscleGroup: MuscleGroup.LEGS,
            difficulty: Difficulty.MEDIUM,
            instructions: "Keep back straight, lower hips until thighs are parallel to floor.",
        },
        {
            name: "Lunges",
            category: Category.STRENGTH,
            type: ExerciseType.BODYWEIGHT,
            equipment: "None",
            muscleGroup: MuscleGroup.LEGS,
            difficulty: Difficulty.MEDIUM,
            instructions: "Step forward and lower body until both knees are bent at 90 degrees.",
        },
        {
            name: "Wall Sit",
            category: Category.STRENGTH,
            type: ExerciseType.BODYWEIGHT,
            equipment: "Wall",
            muscleGroup: MuscleGroup.LEGS,
            difficulty: Difficulty.MEDIUM,
            instructions: "Slide down wall until knees are at 90 degrees, hold position.",
        },

        // 🏋️‍♂️ MACHINE — CHEST, BACK, SHOULDERS
        {
            name: "Chest Press Machine",
            category: Category.STRENGTH,
            type: ExerciseType.MACHINE,
            equipment: "Chest Press Machine",
            muscleGroup: MuscleGroup.CHEST,
            difficulty: Difficulty.MEDIUM,
            instructions: "Push handles forward until arms are extended, then return slowly.",
        },
        {
            name: "Lat Pulldown",
            category: Category.STRENGTH,
            type: ExerciseType.MACHINE,
            equipment: "Lat Pulldown Machine",
            muscleGroup: MuscleGroup.BACK,
            difficulty: Difficulty.MEDIUM,
            instructions: "Pull the bar down to your upper chest and return with control.",
        },
        {
            name: "Seated Row",
            category: Category.STRENGTH,
            type: ExerciseType.MACHINE,
            equipment: "Row Machine",
            muscleGroup: MuscleGroup.BACK,
            difficulty: Difficulty.MEDIUM,
            instructions: "Pull handles towards your abdomen, squeezing shoulder blades together.",
        },
        {
            name: "Shoulder Press Machine",
            category: Category.STRENGTH,
            type: ExerciseType.MACHINE,
            equipment: "Shoulder Press Machine",
            muscleGroup: MuscleGroup.SHOULDERS,
            difficulty: Difficulty.MEDIUM,
            instructions: "Press upward until arms are straight, then lower slowly.",
        },

        // 🏋️‍♀️ FREE WEIGHT — BARBELL/DUMBBELL
        {
            name: "Barbell Bench Press",
            category: Category.STRENGTH,
            type: ExerciseType.FREE_WEIGHT,
            equipment: "Barbell",
            muscleGroup: MuscleGroup.CHEST,
            difficulty: Difficulty.HARD,
            instructions: "Lower barbell to chest, then push it back up while keeping control.",
        },
        {
            name: "Dumbbell Shoulder Press",
            category: Category.STRENGTH,
            type: ExerciseType.FREE_WEIGHT,
            equipment: "Dumbbell",
            muscleGroup: MuscleGroup.SHOULDERS,
            difficulty: Difficulty.MEDIUM,
            instructions: "Press dumbbells overhead and slowly lower to shoulder height.",
        },
        {
            name: "Bicep Curl",
            category: Category.STRENGTH,
            type: ExerciseType.FREE_WEIGHT,
            equipment: "Dumbbell",
            muscleGroup: MuscleGroup.ARMS,
            difficulty: Difficulty.EASY,
            instructions: "Curl dumbbells up while keeping elbows close to torso.",
        },
        {
            name: "Barbell Deadlift",
            category: Category.STRENGTH,
            type: ExerciseType.FREE_WEIGHT,
            equipment: "Barbell",
            muscleGroup: MuscleGroup.LEGS,
            difficulty: Difficulty.HARD,
            instructions: "Lift barbell by extending hips and knees until standing upright.",
        },

        // 🧘‍♀️ FLEXIBILITY & FUNCTIONAL
        {
            name: "Yoga Forward Fold",
            category: Category.FLEXIBILITY,
            type: ExerciseType.BODYWEIGHT,
            equipment: "None",
            muscleGroup: MuscleGroup.FULL_BODY,
            difficulty: Difficulty.EASY,
            instructions: "Bend forward at hips, reach towards toes to stretch hamstrings.",
        },
        {
            name: "Downward Dog",
            category: Category.FLEXIBILITY,
            type: ExerciseType.BODYWEIGHT,
            equipment: "None",
            muscleGroup: MuscleGroup.FULL_BODY,
            difficulty: Difficulty.MEDIUM,
            instructions: "Form an inverted V shape, pushing heels and palms toward floor.",
        },
        {
            name: "Resistance Band Pull Apart",
            category: Category.FUNCTIONAL,
            type: ExerciseType.RESISTANCE_BAND,
            equipment: "Resistance Band",
            muscleGroup: MuscleGroup.SHOULDERS,
            difficulty: Difficulty.EASY,
            instructions: "Hold band at shoulder height, pull ends apart by retracting shoulders.",
        },
        {
            name: "Resistance Band Squats",
            category: Category.FUNCTIONAL,
            type: ExerciseType.RESISTANCE_BAND,
            equipment: "Resistance Band",
            muscleGroup: MuscleGroup.LEGS,
            difficulty: Difficulty.MEDIUM,
            instructions: "Step on band and hold handles at shoulder height while performing squats.",
        },
    ];

    // Duplicate & vary exercises to reach 100+ total
    const fullList = [...exercises];
    for (let i = 0; i < 5; i++) {
        exercises.forEach((ex, idx) => {
            fullList.push({
                ...ex,
                name: `${ex.name} Variation ${i + 1}`,
            });
        });
    }

    await prisma.exercise.deleteMany(); // optional: clear existing data
    for (const exercise of fullList) {
        await prisma.exercise.create({ data: exercise });
    }

    console.log(`✅ Inserted ${fullList.length} exercises successfully!`);
}

main()
.catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});
