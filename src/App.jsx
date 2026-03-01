import React, { useState, useEffect } from "react";
import WorkoutScreen from "./WorkoutScreen";
import ExerciseSelector from "./ExerciseSelector_v2";
import SummaryScreen from "./SummaryScreen";

import { ALL_EXERCISES } from "./data/exercises";

import { supabase } from "./supabaseClient";

import { saveWorkoutToCloud } from "./database/finishWorkout";

import { WORKOUT_PRESETS, BLANK_PRESET } from "./data/presets";

// Define the initial state of exercises here
const INITIAL_DATA = [
//  {
//     id: "1",
//     name: "Barbell Benchpress",
//     icon: "dumbbell",
//     targetReps: "8-10",
//     sets: [
//       { weight: "45+15lbs", reps: "5" },
//       { weight: "45+15lbs", reps: "5" },
//       { weight: "45+15lbs", reps: "5" },
//       { weight: "45+15lbs", reps: "4" },
//       { weight: "45+15lbs", reps: "4" },
//     ],
//     notes: "5x5 last 2 sets were 5x4",
//   },
//   {
//     id: "2",
//     name: "Pull-Ups",
//     icon: "target",
//     targetReps: "8-10",
//     sets: [
//       { weight: "Green", reps: "10", isGreen: true },
//       { weight: "Green", reps: "5 | 3", isGreen: true },
//       { weight: "Green", reps: "5 | 3", isGreen: true },
//       { weight: "Green", reps: "5 | 3", isGreen: true },
//     ],
//   },
//   {
//     id: "3",
//     name: "Incline Dumbbell Curl",
//     icon: "dumbbell",
//     targetReps: "8-10",
//     sets: [
//       { weight: "20lbs", reps: "10" },
//       { weight: "20lbs", reps: "5" },
//       { weight: "15lbs", reps: "10" },
//       { weight: "15lbs", reps: "10" },
//     ],
//   },
//   {
//     id: "4",
//     name: "Leg Extensions",
//     icon: "flame",
//     targetReps: "7-9",
//     sets: [
//       { weight: "85lbs", reps: "10", isRed: true },
//       { weight: "100lbs", reps: "10", isRed: true },
//       { weight: "100lbs", reps: "10", isRed: true },
//       { weight: "100lbs", reps: "10", isRed: true },
//     ],
//   },
//   {
//     id: "5",
//     name: "Spread Out",
//     icon: "dumbbell",
//     targetReps: "8-10",
//     sets: [
//       { weight: "75lbs", reps: "7" },
//       { weight: "75lbs", reps: "10" },
//       { weight: "75lbs", reps: "10" },
//       { weight: "75lbs", reps: "10" },
//     ],
//   },
];

export default function App() {
  // 1. The "Single Source of Truth" for data
  const [currentExercises, setCurrentExercises] = useState(INITIAL_DATA);
  const [selectedPresetKey, setSelectedPresetKey] = useState("");

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
        alert(
          "You need to add at least one exercise before finishing your workout!",
        );
        return;
      }
    }

    // 2. CHECK FOR ACTUAL DATA (No Ghost Rows!) CHECK FOR EMPTY SETS: Make sure at least one exercise has a set with weight or reps filled in.
    const hasValidSets = currentExercises.some((ex) => {
      return ex.sets && ex.sets.some((set) => set.weight || set.reps);
    });

    if (!hasValidSets) {
      alert(
        "You have exercises, but no sets logged! Add some weights or reps to finish.",
      );
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
    <div className="min-h-screen mx-auto bg-zinc-950 text-zinc-50">
      {/* THE LOGIC CHAIN */}

      {isFinished ? (
        // 1. SHOW SUMMARY SCREEN
        <SummaryScreen
          exercises={currentExercises}
          onClose={() => {
            setIsFinished(false);
            setCurrentExercises([]); // Wipes the slate clean!
          }}
        />
      ) : isEditing ? (
        // 2. SHOW EDIT SCREEN
        <ExerciseSelector
          exercises={currentExercises}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : currentExercises.length === 0 ? (
        // 3. SHOW START SCREEN (Because the workout is empty)
        <div className="flex flex-col justify-center h-screen gap-6 p-6">
          <h1 className="mb-4 text-3xl font-bold text-center">
            Ready to lift?
          </h1>

          <div className="flex flex-col gap-3">
            <select
              className="w-full p-4 text-lg text-center border outline-none rounded-xl bg-zinc-900 border-zinc-800 focus:ring-2 focus:ring-emerald-500"
              value={selectedPresetKey}
              onChange={(e) => setSelectedPresetKey(e.target.value)}
            >
              <option value="" disabled>
                Choose a workout preset...
              </option>
              {/* This loops through your presets object and generates the dropdown options! */}
              {Object.entries(WORKOUT_PRESETS).map(([key, preset]) => (
                <option key={key} value={key}>
                  {preset.title}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                if (selectedPresetKey) {
                  // The Deep Copy! Clones the template so the original stays perfectly clean
                  const freshWorkout = structuredClone(
                    WORKOUT_PRESETS[selectedPresetKey].exercises,
                  );
                  setCurrentExercises(freshWorkout);
                  setSelectedPresetKey(""); // Resets the dropdown for next time
                }
              }}
              disabled={!selectedPresetKey}
              className="w-full text-lg font-semibold transition-colors h-14 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 rounded-xl"
            >
              Start Preset
            </button>
          </div>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink-0 mx-4 text-sm text-zinc-500">or</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          <button
            onClick={() => {
              // creates a fresh new variable that clones the blank presets.
              // const freshBlankWorkout = structuredClone(
              //   BLANK_PRESET.blankPreset.exercises,
              // );

              // 2. sets the state
              setCurrentExercises([]);

              // 3. reset the dropdown in case they had something selected
              setSelectedPresetKey("");

              // 4. send user straight to the Exercise Selector to fill in those blank exercises
              setIsEditing(true);
            }}
            className="w-full text-lg font-semibold text-white transition-colors border h-14 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 rounded-xl"
          >
            Start Empty Workout
          </button>
        </div>
      ) : (
        // 4. SHOW WORKOUT SCREEN (Active Workout)
        <WorkoutScreen
          exercises={currentExercises}
          onEdit={() => setIsEditing(true)}
          onUpdateExercises={setCurrentExercises}
          onFinish={handleFinishWorkout}
        />
      )}
    </div>
  );
}
