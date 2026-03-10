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
import WorkoutDetailsScreen from "./WorkoutDetailsScreen";
import { set } from "date-fns";

export default function App() {
  const [currentUser, setCurrentUser] = useState(
    () => localStorage.getItem("current_user") || "",
  );
  const [currentLocation, setCurrentLocation] = useState(
    () => localStorage.getItem("current_location") || "",
  );

  const [isWorkoutActive, setIsWorkoutActive] = useState(
    () => localStorage.getItem("is_workout_active") === "true",
  );
  const [isSelectingPreset, setIsSelectingPreset] = useState(false);

  const [currentExercises, setCurrentExercises] = useState(() => {
    const saved = localStorage.getItem("active_exercises");
    if (!saved) return [];

    try {
      return JSON.parse(saved); // Try to read it
    } catch (error) {
      console.error(
        "Corrupted workout data found in cache. Wiping clean.",
        error,
      );
      localStorage.removeItem("active_exercises"); // Nuke the corrupted data
      return []; // Start fresh so the app doesn't crash
    }
  });

  // 2. View States
  const [isEditing, setIsEditing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

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

  // 💾 AUTO-SAVER: Mirrors react state to localStorage
  useEffect(() => {
    // 1. Save or clear the User profile
    if (currentUser) localStorage.setItem("current_user", currentUser);
    else localStorage.removeItem("current_user");

    if (currentLocation)
      localStorage.setItem("current_location", currentLocation);
    else localStorage.removeItem("current_location");

    // 2. Save the Workout status
    localStorage.setItem("is_workout_active", isWorkoutActive);

    // 3. Save the actual exercises ONLY if a workout is active
    if (isWorkoutActive) {
      localStorage.setItem(
        "active_exercises",
        JSON.stringify(currentExercises),
      );
    } else {
      localStorage.removeItem("active_exercises");
    }
  }, [currentUser, currentLocation, isWorkoutActive, currentExercises]);

  // 📡 THE BACKGROUND WORKER: Syncs offline workouts when internet returns
  useEffect(() => {
    const syncOfflineQueue = async () => {
      // 1. Abort if we don't have internet, or if the queue is empty
      if (!navigator.onLine) return;

      const queueStr = localStorage.getItem("offline_workout_queue");
      if (!queueStr) return;

      const queue = JSON.parse(queueStr);
      if (queue.length === 0) return;

      console.log(
        `📡 Internet is active! Attempting to sync ${queue.length} stashed workouts...`,
      );

      // 2. THE PULL AND CLEAR
      // Wipe the queue from the hard drive so we don't create duplicates.
      // (If the save fails again, saveWorkoutToCloud will automatically put them back!)
      localStorage.removeItem("offline_workout_queue");

      // 3. Process the queue one by one
      for (const stashedWorkout of queue) {
        console.log(
          `🔄 Syncing stashed workout from ${stashedWorkout.timestamp}...`,
        );

        // We use our existing, untouched backend function!
        await saveWorkoutToCloud(
          stashedWorkout.workoutMetadata,
          stashedWorkout.exercisesArray,
        );
      }

      console.log("✅ Offline sync complete.");
    };

    // Trigger 1: Run on initial app boot-up
    syncOfflineQueue();

    // Trigger 2: Listen for the exact moment the phone connects to a network
    window.addEventListener("online", syncOfflineQueue);

    // Cleanup the listener if the app closes
    return () => window.removeEventListener("online", syncOfflineQueue);
  }, []);

  // Send the data to Supabase and then show the Summary Screen if successful
  const handleFinishWorkout = async (workoutMetadata) => {
    // --- 1. SET DEFINITIONS (The 3 States of a Set) ---
    const isValidRep = (repValue) => {
      const parsed = parseInt(repValue, 10);
      return !isNaN(parsed) && parsed > 0;
    };

    // State A: Perfectly valid and ready to save
    const isValidSet = (set) => set.weight && set.reps && isValidRep(set.reps);

    // State B: Completely untouched by the user
    const isBlankSet = (set) => !set.weight && !set.reps;

    // State C: A problem (half-filled, or contains invalid characters like "Q")
    const isProblemSet = (set) => !isBlankSet(set) && !isValidSet(set);

    const hasAnyValidSets = (ex) => ex.sets?.some(isValidSet);
    const hasAnyProblemSets = (ex) => ex.sets?.some(isProblemSet);

    // --- 2. THE GUARDRAILS ---

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

    // Guardrail 3: The "Bad Data" Rule (Catches the "Q")
    // We check for bad data BEFORE checking for empty exercises.
    const exercisesWithProblems = currentExercises.filter(hasAnyProblemSets);

    if (exercisesWithProblems.length > 0) {
      const problemNames = exercisesWithProblems
        .map((ex) => ex.name)
        .join(", ");
      alert(
        `You have invalid sets in: ${problemNames}! Please ensure BOTH weight and reps are filled out, and that Reps is a valid number.`,
      );
      return;
    }

    // Guardrail 4: The "Ghost Rows" Rule
    // If we made it here, there is NO bad data. Now we check if they left an exercise completely blank.
    const incompleteExercises = currentExercises.filter(
      (ex) => !hasAnyValidSets(ex),
    );

    if (incompleteExercises.length > 0) {
      const problemExercises = incompleteExercises
        .map((ex) => ex.name)
        .join(", ");
      alert(
        `You have empty exercises! Please fill out at least one valid set for: ${problemExercises}, or remove them to finish.`,
      );
      return;
    }

    // --- 3. THE SAVE PROCESS ---
    console.log("Finish button clicked! Starting save...");
    console.log("Finish button clicked! Received metadata:", workoutMetadata);

    // Extra Last Resort Guardrail: The payload scrubber
    // We use the new hasAnyValidSets definition here to ensure only perfect data passes
    const scrubbedExercises = currentExercises.filter(hasAnyValidSets);

    const result = await saveWorkoutToCloud(
      { userName: currentUser, location: currentLocation },
      scrubbedExercises,
    );

    if (result.success) {
      setRecentPRs(result.prs);
      setIsFinished(true);
      // data/wifi-deadzone catch: Let the user know if they are operating offline!
      if (result.offline) {
        alert(
          "Connection issue detected. Your workout was saved locally and will sync when you regain internet!",
        );
      }
    } else {
      alert("Oops! There was a critical error saving your workout.");
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
      {currentUser &&
        !isSelectingPreset &&
        !isWorkoutActive &&
        !isFinished &&
        !isViewingDetails && (
          <DashboardScreen
            currentUser={currentUser}
            // When they click the '+', we flip the traffic cop to true!
            onStartWorkout={() => setIsSelectingPreset(true)}
            // If they want to change users, we clear the name to send them back to Welcome
            onBack={() => {
              setCurrentUser("");
              setCurrentLocation("");
              // This should auto-trigger the useEffect to wipe the user cache..?
            }}
            onWorkoutClick={(workoutId) => {
              setSelectedWorkoutId(workoutId);
              setIsViewingDetails(true);
            }}
          />
        )}

      {isViewingDetails && (
        <WorkoutDetailsScreen
          workoutId={selectedWorkoutId}
          onBack={() => {
            setSelectedWorkoutId(null);
            setIsViewingDetails(false); // 👇 Turns it off and goes back to dashboard
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
