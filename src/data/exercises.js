// This file is purely for data. No React, no HTML.
// Using CONSTANT_CASE is a common convention for static data.

// export const ALL_EXERCISES = [
//   { value: "barbell benchpress", label: "Barbell Benchpress" },
//   { value: "dumbbell bench press", label: "Dumbbell Bench Press" },
//   { value: "incline barbell press", label: "Incline Barbell Press" },
//   { value: "machine chest press", label: "Machine Chest Press" },
//   { value: "cable fly", label: "Cable Fly" },
//   { value: "pull-ups", label: "Pull-Ups" },
//   { value: "leg extensions", label: "Leg Extensions" },
//   { value: "squat", label: "Squat" },
//   { value: "deadlift", label: "Deadlift" },
// ]

export const REP_RANGES = [
  { value: "3-5", label: "3-5 reps" },
  { value: "5-7", label: "5-7 reps" },
  { value: "8-10", label: "8-10 reps" },
  { value: "10-12", label: "10-12 reps" },
//   { value: "12-14", label: "12-14 reps" },
//   { value: "15-20", label: "15-20 reps" },
]

export const ALL_EXERCISES = [
  { value: "Barbell Benchpress", label: "Barbell Benchpress", type: "freeweight" },
  { value: "Pull-Ups", label: "Pull-Ups", type: "bodyweight" },
  { value: "Leg Press", label: "Leg Press", type: "machine" },
  { value: "Leg Curls", label: "Leg Curls", type: "machine" },
  { value: "Kneeling Single Arm Cable Row", label: "Kneeling Single Arm Cable Row", type: "cable" },
  { value: "Lat Pulldown", label: "Lat Pulldown", type: "machine"},
  { value: "Wide Grip Lat Pulldown", label: "Wide Grip Lat Pulldown", type: "machine" },
  { value: "Close Grip Cable Row", label: "Close Grip Cable Row", type: "cable" },
  { value: "Cross Cable Tricep Extension", label: "Cross Cable Tricep Extension", type: "cable" },
  { value: "Barbell Incline Bench Press", label: "Barbell Incline Bench Press", type: "freeweight" },
  { value: "Seated Pec Deck", label: "Seated Pec Deck", type: "machine" },
  { value: "Dumbbell Shoulder Press", label: "Dumbbell Shoulder Press", type: "freeweight" },
  { value: "Hammer Curls", label: "Hammer Curls", type: "freeweight" },
  { value: "Decline Benchpress", label: "Decline Benchpress", type: "freeweight" },
  { value: "Dumbbell Supinated Curls", label: "Dumbbell Supinated Curls", type: "freeweight" },
  { value: "Cable Y Raises", label: "Cable Y Raises", type: "cable" },
  { value: "DB Lateral Raises", label: "DB Lateral Raises", type: "freeweight" },
  { value: "EZ Bar Skullcrusher", label: "EZ Bar Skullcrusher", type: "freeweight" },
  { value: "EZ Bar Bicep Curl", label: "EZ Bar Bicep Curl", type: "freeweight" },
  { value: "Cable Overhead Tricep Extension", label: "Cable Overhead Tricep Extension", type: "cable" },
  { value: "Incline Lateral Raises", label: "Incline Lateral Raises", type: "freeweight" },
  { value: "DB Preacher Curl", label: "DB Preacher Curl", type: "freeweight" },
  { value: "EZ Bar Reverse Curls", label: "EZ Bar Reverse Curls", type: "freeweight" },
  { value: "T-Bar Row", label: "T-Bar Row", type: "machine" },
  { value: "Face Pull", label: "Face Pull", type: "cable" },
  { value: "EZ Bar Tricep Press", label: "EZ Bar Tricep Press", type: "freeweight" },
  { value: "AB Roller Wheel", label: "AB Roller Wheel", type: "bodyweight" },
  { value: "Weighted AB Crunch", label: "Weighted AB Crunch", type: "machine" },
  { value: "Leg Raises", label: "Leg Raises", type: "bodyweight" },
  { value: "Hack Squat", label: "Hack Squat", type: "machine" },
  { value: "Trap Bar Deadlift", label: "Trap Bar Deadlift", type: "freeweight" },
  { value: "Bulgarian Split Squat", label: "Bulgarian Split Squat", type: "freeweight" },
  { value: "Hamstring Curls", label: "Hamstring Curls", type: "machine" },
  { value: "Calf Raises", label: "Calf Raises", type: "machine" },
  { value: "Abductor Machine (Spread Out)", label: "Abductor Machine (Spread Out)", type: "machine" },
  { value: "Adductor Machine (Squeeze In)", label: "Adductor Machine (Squeeze In)", type: "machine" },
  { value: "Dips", label: "Dips", type: "bodyweight" },
  { value: "Bayesian Cable Curls", label: "Bayesian Cable Curls", type: "cable" },
  { value: "Supinated Incline Curls", label: "Supinated Incline Curls", type: "freeweight"},
  // { value: "Test Squat 999", label: "Test Squat 999", type: "freeweight"},
  // { value: "Test Cable 999", label: "Test Cable 999", type: "cable"},
];






// Freeweight =  Universal
// Bodyweight = Universal
// Machine = Location Dependent
// Cable = Location Dependent