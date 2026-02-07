import React, { useState } from 'react';
import WorkoutScreen from './WorkoutScreen';
import ExerciseSelector from './ExerciseSelector_v2';

import { ALL_EXERCISES } from './data/exercises';  // Move static data here initially // is this needed here? I might just call it in ExerciseSelector_v2.jsx.

// Define the initial state of exercises here
const INITIAL_DATA = [
  {
    id: "1",
    name: "Barbell Benchpress",
    icon: "dumbbell",
    targetReps: "8-10",
    sets: [
      { weight: "45+15lbs", reps: "5" },
      { weight: "45+15lbs", reps: "5" },
      { weight: "45+15lbs", reps: "5" },
      { weight: "45+15lbs", reps: "4" },
      { weight: "45+15lbs", reps: "4" },
    ],
    notes: "5x5 last 2 sets were 5x4",
  },
  {
    id: "2",
    name: "Pull-Ups",
    icon: "target",
    targetReps: "8-10",
    sets: [
      { weight: "Green", reps: "10", isGreen: true },
      { weight: "Green", reps: "5 | 3", isGreen: true },
      { weight: "Green", reps: "5 | 3", isGreen: true },
      { weight: "Green", reps: "5 | 3", isGreen: true },
    ],
  },
  {
    id: "3",
    name: "Incline Dumbbell Curl",
    icon: "dumbbell",
    targetReps: "8-10",
    sets: [
      { weight: "20lbs", reps: "10" },
      { weight: "20lbs", reps: "5" },
      { weight: "15lbs", reps: "10" },
      { weight: "15lbs", reps: "10" },
    ],
  },
  {
    id: "4",
    name: "Leg Extensions",
    icon: "flame",
    targetReps: "7-9",
    sets: [
      { weight: "85lbs", reps: "10", isRed: true },
      { weight: "100lbs", reps: "10", isRed: true },
      { weight: "100lbs", reps: "10", isRed: true },
      { weight: "100lbs", reps: "10", isRed: true },
    ],
  },
  {
    id: "5",
    name: "Spread Out",
    icon: "dumbbell",
    targetReps: "8-10",
    sets: [
      { weight: "75lbs", reps: "7" },
      { weight: "75lbs", reps: "10" },
      { weight: "75lbs", reps: "10" },
      { weight: "75lbs", reps: "10" },
    ],
  },
];

export default function App() {
  // 1. The "Single Source of Truth" for data
  const [currentExercises, setCurrentExercises] = useState(INITIAL_DATA);
  
  // 2. The state that controls which screen is visible
  const [isEditing, setIsEditing] = useState(false);

  // Function to handle saving changes from ExerciseSelector
  const handleSave = (updatedExercises) => {
    setCurrentExercises(updatedExercises); // Update the master list
    setIsEditing(false); // Go back to workout screen
  };

  return (
    <div>
      {isEditing ? (
        // SHOW EDIT SCREEN
        <ExerciseSelector 
          exercises={currentExercises} 
          onSave={handleSave}
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        // SHOW WORKOUT SCREEN
        <WorkoutScreen 
          exercises={currentExercises}
          onEdit={() => setIsEditing(true)} 
      
      // 3. PASS THE SETTER DOWN
      onUpdateExercises={setCurrentExercises}
        />
      )}
    </div>
  );
}