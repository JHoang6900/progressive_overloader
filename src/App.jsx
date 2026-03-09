import React, { useState, useEffect } from "react";
import WorkoutScreen from "./WorkoutScreen";
import ExerciseSelector from "./ExerciseSelector_v2";
import SummaryScreen from "./SummaryScreen";

import { ALL_EXERCISES } from "./data/exercises";

import { supabase } from "./supabaseClient";

import { saveWorkoutToCloud } from "./database/finishWorkout";

import { WORKOUT_PRESETS, BLANK_PRESET } from "./data/presets";

import WelcomeScreen from "./WelcomeScreen";
import DashboardScreen from "./DashboardScreen";
import PresetScreen from "./PresetScreen";

// Define the initial state of exercises here
const INITIAL_DATA = [];

export default function App() {
  const [currentUser, setCurrentUser] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");

  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isSelectingPreset, setIsSelectingPreset] = useState(false);

  // 1. The "Single Source of Truth" for data
  const [currentExercises, setCurrentExercises] = useState(INITIAL_DATA);
  const [selectedPresetKey, setSelectedPresetKey] = useState("");

  // 2. View States
  const [isEditing, setIsEditing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // State to hold trophies between the Workout and Summary screens
  const [recentPRs, setRecentPRs] = useState([]);

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
    // 👇 STRICT MODE: A set only counts if it has BOTH weight AND reps.
    const hasValidSet = (set) => set.weight && set.reps;
    const hasAnySets = (ex) => ex.sets?.some(hasValidSet);

    // 👇 STRICT MODE: A row is a problem if it is missing weight OR missing reps.
    const hasProblemRow = (ex) =>
      ex.sets?.some((set) => !set.weight || !set.reps);



    // Guardrail 1: Empty Gym Floor
    if (!currentExercises || currentExercises.length === 0) {
      alert(
        "You need to add at least one exercise before finishing your workout!",
      );
      return;
    }

    // Guardrail 2: Missing Names
    const hasUnnamedExercises = currentExercises.some(
      (ex) => !ex.name || ex.name.trim() === "",
    );

    if (hasUnnamedExercises) {
      alert(
        "Oops! Please select an exercise name for all your blank cards before finishing.",
      );
      return;
    }

    // Guardrail 3: The "No Ghost Rows Allowed" Rule
    const incompleteExercises = currentExercises.filter(
      (ex) => !hasAnySets(ex),
    );

    if (incompleteExercises.length > 0) {
      const problemExercises = incompleteExercises
        .map((ex) => ex.name)
        .join(", ");
      alert(
        `You have empty exercises! Please fill out at least one set for: ${problemExercises}, or remove them to finish.`,
      );
      return;
    }

    // 👇 Guardrail 4: The "No Half-Empty Sets" Rule
    // Find exercises that have at least one good set, BUT also have a half-empty row hanging out
    const exercisesWithProblems = currentExercises.filter(
      (ex) => hasAnySets(ex) && hasProblemRow(ex),
    );

    if (exercisesWithProblems.length > 0) {
      const problemNames = exercisesWithProblems
        .map((ex) => ex.name)
        .join(", ");
      alert(
        `You have incomplete sets in: ${problemNames}. You must enter BOTH weight and reps for every row, or delete the empty ones!`,
      );
      return;
    }

    console.log("Finish button clicked! Starting save...");
    console.log("Finish button clicked! Received metadata:", workoutMetadata);

    // Extra Last Resort Guardrail: The payload scrubber (just in case! -- theoretically shouldn't ever need to do any work because of the above checks, but it's good to have this safety net to prevent dirty data from sneaking into the database)
    const scrubbedExercises = currentExercises.filter(hasAnySets);

// 👇 1. Let's call the package 'result' instead of 'isSaved'
    const result = await saveWorkoutToCloud(
      { userName: currentUser, location: currentLocation },
      scrubbedExercises,
    );

    // 👇 2. Look inside the package for 'success'
    if (result.success) {
      // 👇 3. Look inside the package for 'prs' and save them to App.jsx's state!
      setRecentPRs(result.prs);
      
      setIsFinished(true); 
    } else {
      alert("Oops! There was an error saving your workout to the cloud.");
    }
  };
  return (
    <>
      {/* ROUTE 1: The Gatekeeper (No user selected yet) */}
      {!currentUser && (
        <WelcomeScreen
          onStart={(name, location) => {
            setCurrentUser(name);
            setCurrentLocation(location);
          }}
        />
      )}

      {/* ROUTE 2: The Dashboard (User selected, but hasn't started lifting) */}
      {currentUser && !isSelectingPreset && !isWorkoutActive && !isFinished && (
        <DashboardScreen
          currentUser={currentUser}
          // When they click the '+', we flip the traffic cop to true!
          onStartWorkout={() => setIsSelectingPreset(true)}
          // If they want to change users, we clear the name to send them back to Welcome
          onBack={() => {
            setCurrentUser("");
            setCurrentLocation("");
          }}
        />
      )}

      {/* ROUTE 2.5: The Preset Selection Screen */}
      {currentUser && isSelectingPreset && !isWorkoutActive && !isFinished && (
        <PresetScreen
          currentUser={currentUser}
          onStartPreset={(freshWorkout) => {
            setCurrentExercises(freshWorkout);
            setIsSelectingPreset(false);
            setIsWorkoutActive(true);
          }}
          onStartEmpty={() => {
            setCurrentExercises([]);
            setIsSelectingPreset(false);
            setIsWorkoutActive(true);
            setIsEditing(true); // Sends them straight to edit mode as you intended!
          }}
          onCancel={() => setIsSelectingPreset(false)}
        />
      )}

      {/* ROUTE 3: The Active Workout (User is actively lifting) */}
      {/* 👇 Added !isEditing so this hides when the selector opens */}
      {currentUser && isWorkoutActive && !isEditing && !isFinished && (
        <WorkoutScreen
          exercises={currentExercises}
          onEdit={() => setIsEditing(true)}
          onUpdateExercises={setCurrentExercises}
          onFinish={handleFinishWorkout}
          currentUser={currentUser}
          currentLocation={currentLocation}
          onCancel={() => setIsWorkoutActive(false)}
        />
      )}

      {/* ROUTE 3.5: The Exercise Selector (User is adding/editing exercises) */}
      {/* 👇 NEW: The dedicated route for your full-screen selector! */}
      {currentUser && isWorkoutActive && isEditing && !isFinished && (
        <ExerciseSelector
          exercises={currentExercises} // Passes your current list
          onSave={handleSave} // Uses your existing handleSave function!
          onCancel={() => setIsEditing(false)} // Let them back out without saving
        />
      )}

      {/* ROUTE 4: The Finished Workout (User has finished lifting) */}
      {currentUser && isFinished && (
        <SummaryScreen
          exercises={currentExercises}
          onClose={() => {
            setIsFinished(false);
            setCurrentExercises([]); // Wipes the slate clean!
            setIsWorkoutActive(false); // Send them back to the dashboard
          }}
          currentUser={currentUser}
          recentPRs={recentPRs} // Pass the recently earned PRs to the SummaryScreen
        />
      )}
    </>
  );
}

// handleFinishWorkout is the function that gets called when the user clicks the "Finish Workout" button on the WorkoutScreen. It performs several important tasks:

// 1. Validation Guardrails: It checks to make sure the workout has at least one exercise, and that at least one set has weight or reps filled in. If these conditions aren't met, it shows an alert and stops the save process.
// 2. Data Logging: It logs the workout metadata and exercises to the console for debugging purposes.
// 3. Data Scrubbing: It filters out any exercises that don't have valid sets (no weight or reps) before attempting to save.
// 4. Saving to Supabase: It calls the saveWorkoutToCloud function, passing in the user/location metadata and the scrubbed exercises array.
// 5. Conditional Navigation: If the save is successful, it sets the isFinished state to true, which triggers the SummaryScreen to show. If there's an error during saving, it alerts the user.

// pseudo code:
// 1. Check if the workout has at least one exercise
// 2. Check if at least one set has weight or reps filled in
// 3. Log the workout metadata and exercises to the console
// 4. Filter out any exercises that don't have valid sets
// 5. Call the saveWorkoutToCloud function
// 6. Conditional navigation

// FINISH WORKOUT STEPS:
// 1. Setup: Define what a "valid set" looks like.
// 2. Formatting Check: Prevent saving if any exercise cards are left blank/unnamed.
// 3. Existence Check: Prevent saving if the gym floor is completely empty.
// 4. Validity Check: Prevent saving if they added exercises but didn't log any weights/reps.
// 5. Sanitize: Filter out the "ghost rows" (exercises where they logged 0 sets).
// 6. Execute: Send the perfectly scrubbed data to Supabase.
// 7. Route: If successful, navigate to the congratulatory Summary screen!
