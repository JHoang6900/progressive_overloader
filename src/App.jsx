import React, { useState, useEffect } from "react";
import WorkoutScreen from "./WorkoutScreen";
import ExerciseSelector from "./ExerciseSelector_v2";
import SummaryScreen from "./SummaryScreen";

import { ALL_EXERCISES } from "./data/exercises";

import { supabase } from "./supabaseClient";

import { saveWorkoutToCloud } from "./database/finishWorkout";

// Define the initial state of exercises here
const INITIAL_DATA = [
  {
    id: "1",
    name: "Barbell Benchpress",
    icon: "dumbbell",
    targetReps: "8-10",
    sets: [
      { weight: "", reps: "" },
      { weight: "", reps: "" },
      { weight: "", reps: "" },
      { weight: "", reps: "" },
      { weight: "", reps: "" },
    ],
    notes: "Felt strong today! Could have pushed for 99 reps on the last set.",
  },
  {
    id: "2",
    name: "Pull-Ups",
    icon: "target",
    targetReps: "8-10",
        sets: [
      { weight: "", reps: "" },
      { weight: "", reps: "" },
      { weight: "", reps: "" },
      { weight: "", reps: "" },
    ],
  },
  {
    id: "3",
    name: "Incline Dumbbell Curl",
    icon: "dumbbell",
    targetReps: "8-10",
        sets: [
      { weight: "", reps: "" },
      { weight: "", reps: "" },
      { weight: "", reps: "" },
      { weight: "", reps: "" },
    ],
  },
  {
    id: "4",
    name: "Leg Extensions",
    icon: "flame",
    targetReps: "7-9",
        sets: [
      { weight: "", reps: "" },
      { weight: "", reps: "" },
      { weight: "", reps: "" },
      { weight: "", reps: "" },
    ],
  },
  {
    id: "5",
    name: "Spread Out",
    icon: "dumbbell",
    targetReps: "8-10",
    sets: [
      { weight: "", reps: "" },
      { weight: "", reps: "" },
      { weight: "", reps: "" },
      { weight: "", reps: "" },
      { weight: "", reps: "" },
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


    {
  // 1. THE VALIDATION GUARDRAIL: Make sure there's at least 1 exercise before allowing the user to finish.
  if (!currentExercises || currentExercises.length === 0) {
    // Stop the function immediately and warn the user
    alert("You need to add at least one exercise before finishing your workout!");
    return; 
  }
}

  // 2. CHECK FOR ACTUAL DATA (No Ghost Rows!) CHECK FOR EMPTY SETS: Make sure at least one exercise has a set with weight or reps filled in.
  const hasValidSets = currentExercises.some(ex => {
    return ex.sets && ex.sets.some(set => set.weight || set.reps);
  });

  if (!hasValidSets) {
    alert("You have exercises, but no sets logged! Add some weights or reps to finish.");
    return;
  }


    console.log("Finish button clicked! Starting save...");
    console.log("Finish button clicked! Received metadata:", workoutMetadata);
    console.log(
      "Finish button clicked! Current exercises to save:",
      currentExercises,
    );

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
            setIsFinished(false); // Go back to workout screen
            setCurrentExercises([]); // WIPE THE SLATE CLEAN!
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
