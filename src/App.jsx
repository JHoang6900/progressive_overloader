import React, { useState } from 'react';
import WorkoutScreen from './WorkoutScreen';
import ExerciseSelector from './ExerciseSelector_v2';
import SummaryScreen from './SummaryScreen';

import { ALL_EXERCISES } from './data/exercises'; 

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
  
  // 2. View States
  const [isEditing, setIsEditing] = useState(false);
  const [isFinished, setIsFinished] = useState(false); 

  // Function to handle saving changes from ExerciseSelector
  const handleSave = (updatedExercises) => {
    setCurrentExercises(updatedExercises); // Update the master list
    setIsEditing(false); // Go back to workout screen
  };

  return (
    <div>
      {/* THE LOGIC CHAIN 
         Structure: Condition ? (True) : Condition2 ? (True) : (False/Default)
      */}

      {isFinished ? (
        // 1. SHOW SUMMARY SCREEN
        <SummaryScreen 
           exercises={currentExercises} 
           onClose={() => {
              setIsFinished(false);
              // Optional: Reset workout logic would go here
           }} 
        />
      ) : isEditing ? (
        // 2. SHOW EDIT SCREEN
        <ExerciseSelector 
          exercises={currentExercises} 
          onSave={handleSave}
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        // 3. SHOW WORKOUT SCREEN (Default)
        <WorkoutScreen 
          exercises={currentExercises}
          onEdit={() => setIsEditing(true)} 
          onUpdateExercises={setCurrentExercises}
          onFinish={() => setIsFinished(true)} // <--- Connects the button
        />
      )}
    </div>
  );
}