import React, { useState, useEffect } from 'react';
import WorkoutScreen from './WorkoutScreen';
import ExerciseSelector from './ExerciseSelector_v2';
import SummaryScreen from './SummaryScreen';

import { ALL_EXERCISES } from './data/exercises'; 

import { supabase } from './supabaseClient'; 

import { saveWorkoutToCloud } from './database/finishWorkout';

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



  // Test Supabase connection on app load
  useEffect(() => {
    const testConnection = async () => {
      // We ask Supabase for the current user session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("❌ Supabase Connection Failed:", error.message);
      } else {
        console.log("✅ Supabase is connected! Data:", data);
      }
    };

    testConnection();
  }, []);


// Send the data to Supabase and then show the Summary Screen if successful
const handleFinishWorkout = async (workoutMetadata) => {
  console.log("Finish button clicked! Starting save...");
  console.log("Finish button clicked! Received metadata:", workoutMetadata);
  console.log("Finish button clicked! Current exercises to save:", currentExercises);
  
  // 1. Send the data to Supabase using the state App.jsx already has!
  const isSaved = await saveWorkoutToCloud(workoutMetadata, currentExercises);
  
  // 2. ONLY show the Summary Screen if the database successfully saved it
  if (isSaved) {
    setIsFinished(true); 
  } else {
    // You can replace this with a nice toast notification later!
    alert("Oops! There was an error saving your workout to the cloud.");
  }
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
          onFinish={handleFinishWorkout} // <--- Connects the button
        />
      )}
    </div>
  );
}