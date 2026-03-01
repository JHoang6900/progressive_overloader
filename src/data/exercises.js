// This file is purely for data. No React, no HTML.
// Using CONSTANT_CASE is a common convention for static data.

// export const ALL_EXERCISES = [
//   { value: "barbell benchpress", label: "Barbell Benchpress" },
//   { value: "dumbbell bench press", label: "Dumbbell Bench Press" },
//   { value: "incline barbell press", label: "Incline Barbell Press" },
//   { value: "machine chest press", label: "Machine Chest Press" },
//   { value: "cable fly", label: "Cable Fly" },
//   { value: "pull-ups", label: "Pull-Ups" },
//   { value: "lat pulldown", label: "Lat Pulldown" },
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
  { value: "barbell-benchpress", label: "Barbell Benchpress", type: "freeweight" },
  { value: "pull-ups", label: "Pull-Ups", type: "bodyweight" },
  { value: "leg-press", label: "Leg Press", type: "machine" },
  { value: "glute-curls", label: "Glute Curls", type: "machine" },
  { value: "kneeling-single-arm-cable-row", label: "Kneeling Single Arm Cable Row", type: "cable" },
  { value: "wide-grip-lat-pulldown", label: "Wide Grip Lat Pulldown", type: "machine" },
  { value: "close-grip-cable-row", label: "Close Grip Cable Row", type: "cable" },
  { value: "cross-cable-tricep-extension", label: "Cross Cable Tricep Extension", type: "cable" },
  { value: "barbell-incline-bench-press", label: "Barbell Incline Bench Press", type: "freeweight" },
  { value: "seated-pec-deck", label: "Seated Pec Deck", type: "machine" },
  { value: "dumbbell-shoulder-press", label: "Dumbbell Shoulder Press", type: "freeweight" },
  { value: "hammer-curls", label: "Hammer Curls", type: "freeweight" },
  { value: "decline-benchpress", label: "Decline Benchpress", type: "freeweight" },
  { value: "dumbbell-supinated-curls", label: "Dumbbell Supinated Curls", type: "freeweight" },
  { value: "cable-y-raises", label: "Cable Y Raises", type: "cable" },
  { value: "db-lateral-raises", label: "DB Lateral Raises", type: "freeweight" },
  { value: "ez-bar-skullcrusher", label: "EZ Bar Skullcrusher", type: "freeweight" },
  { value: "ez-bar-bicep-curl", label: "EZ Bar Bicep Curl", type: "freeweight" },
  { value: "cable-overhead-tricep-extension", label: "Cable Overhead Tricep Extension", type: "cable" },
  { value: "incline-lateral-raises", label: "Incline Lateral Raises", type: "freeweight" },
  { value: "db-preacher-curl", label: "DB Preacher Curl", type: "freeweight" },
  { value: "ez-bar-reverse-curls", label: "EZ Bar Reverse Curls", type: "freeweight" },
  { value: "t-bar-row", label: "T-Bar Row", type: "machine" },
  { value: "face-pull", label: "Face Pull", type: "cable" },
  { value: "ez-bar-tricep-press", label: "EZ Bar Tricep Press", type: "freeweight" },
  { value: "ab-roller-wheel", label: "AB Roller Wheel", type: "bodyweight" },
  { value: "weighted-ab-crunch", label: "Weighted AB Crunch", type: "machine" },
  { value: "leg-raises", label: "Leg Raises", type: "bodyweight" },
  { value: "hack-squat", label: "Hack Squat", type: "machine" },
  { value: "trap-bar-deadlift", label: "Trap Bar Deadlift", type: "freeweight" },
  { value: "bulgarian-split-squat", label: "Bulgarian Split Squat", type: "freeweight" },
  { value: "hamstring-curls", label: "Hamstring Curls", type: "machine" },
  { value: "calf-raises", label: "Calf Raises", type: "machine" },
  { value: "abductor-machine-spread-out", label: "Abductor Machine (Spread Out)", type: "machine" },
  { value: "adductor-machine-squeeze-in", label: "Adductor Machine (Squeeze In)", type: "machine" },
  { value: "dips", label: "Dips", type: "bodyweight" }
];



// Freeweight =  Universal
// Bodyweight = Universal
// Machine = Location Dependent
// Cable = Location Dependent