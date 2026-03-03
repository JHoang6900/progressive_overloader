// src/data/presets.js

// 1. The Factory Function (Saves us hundreds of lines of code)
const createExercise = (id, name, icon = "dumbbell", targetReps = "8-10") => ({
  id,
  name,
  icon,
  targetReps,
  sets: [{ weight: "", reps: "" }], // Every exercise starts with one empty set!
});

// 2. The Master Presets Object
export const WORKOUT_PRESETS = {
  fullBodyCompound: {
    title: "Full Body Compound",
    exercises: [
      createExercise("fbc-1", "Barbell Benchpress"),
      createExercise("fbc-2", "Pull-Ups", "target"),
      createExercise("fbc-3", "Bayesian Cable Curls"),
      createExercise("fbc-4", "Leg Press"),
      createExercise("fbc-5", "Glute Curls", "flame"),
    ]
  },
  pullLatBias: {
    title: "Pull (Lat Bias) + Triceps",
    exercises: [
      createExercise("plb-1", "Pull-Ups", "target"),
      createExercise("plb-2", "Kneeling Single Arm Cable Row"),
      createExercise("plb-3", "Wide Grip Lat Pulldown"),
      createExercise("plb-4", "Close Grip Cable Row"),
      createExercise("plb-5", "Cross Cable Tricep Extension"),
    ]
  },
  pressBiceps: {
    title: "Press / Biceps",
    exercises: [
      createExercise("pb-1", "Barbell Incline Bench Press"),
      createExercise("pb-2", "Seated Pec Deck"),
      createExercise("pb-3", "Dumbbell Shoulder Press"),
      createExercise("pb-4", "Hammer Curls"),
      createExercise("pb-5", "Hack Squat", "flame"),
    ]
  },
  pressBiceps2: {
    title: "Press / Biceps 2",
    exercises: [
      createExercise("pb2-1", "Barbell Benchpress"),
      createExercise("pb2-2", "Decline Benchpress"),
      createExercise("pb2-3", "Incline Lateral Raises"),
      createExercise("pb2-4", "Dumbbell Supinated Curls"),
      createExercise("pb2-5", "EZ Bar Reverse Curls"),
    ]
  },
  armsDeltsOG: {
    title: "Arms / Delts OG",
    exercises: [
      createExercise("ado-1", "Cable Y Raises"),
      createExercise("ado-2", "DB Lateral Raises"),
      createExercise("ado-3", "EZ Bar Skullcrusher"),
      createExercise("ado-4", "EZ Bar Bicep Curl"),
      createExercise("ado-5", "Cable Overhead Tricep Extension"),
      createExercise("ado-6", "Hammer Curls"),
      createExercise("ado-7", "Supinated Incline Curls"),
    ]
  },
  armsDeltsVJH: {
    title: "Arms / Delts vJH",
    exercises: [
      createExercise("adjh-1", "EZ Bar Skullcrusher"),
      createExercise("adjh-2", "Cable Overhead Tricep Extension"),
      createExercise("adjh-3", "Incline Lateral Raises"),
      createExercise("adjh-4", "DB Lateral Raises"),
      createExercise("adjh-5", "DB Preacher Curl"),
      createExercise("adjh-6", "EZ Bar Reverse Curls"),
    ]
  },
  pullUpperBack: {
    title: "Pull (Upper Back Bias) + Triceps",
    exercises: [
      createExercise("pub-1", "T-Bar Row"),
      createExercise("pub-2", "Face Pull"),
      createExercise("pub-3", "Calf Raises", "flame"),
      createExercise("pub-4", "EZ Bar Tricep Press"),
    ]
  },
  hypercore: {
    title: "Hypercore",
    exercises: [
      createExercise("hc-1", "AB Roller Wheel", "target"),
      createExercise("hc-2", "Weighted AB Crunch"),
      createExercise("hc-3", "Leg Raises"),
    ]
  },
  lowerBody: {
    title: "Lower Body",
    exercises: [
      createExercise("lb-1", "Hack Squat", "flame"),
      createExercise("lb-2", "Trap Bar Deadlift", "flame"),
      createExercise("lb-3", "Bulgarian Split Squat", "flame"),
      createExercise("lb-4", "Hamstring Curls"),
      createExercise("lb-5", "Calf Raises"),
      createExercise("lb-6", "Adductor Machine (Squeeze In)"),
      createExercise("lb-7", "Abductor Machine (Spread Out)")
    ]
  },
};

export const BLANK_PRESET = {
  blankPreset: {
    title: "Blank Preset",
    exercises: [
      createExercise("blank-1", ""),
      createExercise("blank-2", ""),
      createExercise("blank-3", ""),
      createExercise("blank-4", ""),
      createExercise("blank-5", ""),
    ]
  }
}