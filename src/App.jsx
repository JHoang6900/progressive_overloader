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
  const [isSelectingPreset, setIsSelectingPreset] = useState(false)


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
    
          // Guard Rail: Make sure all exercises have names before allowing the save to proceed.
  const hasUnnamedExercises = currentExercises.some(ex => !ex.name || ex.name.trim() === "");
  
  if (hasUnnamedExercises) {
    alert("Oops! Please select an exercise name for all your blank cards before finishing.");
    return; // Stops the save!
  }


      // 1. THE VALIDATION GUARDRAIL: Make sure there's at least 1 exercise before allowing the user to finish.
      if (!currentExercises || currentExercises.length === 0) {
        // Stop the function immediately and warn the user
        alert(
          "You need to add at least one exercise before finishing your workout!",
        );
        return;
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
    console.log("Finish button clicked! Current user is:", currentUser);
    console.log("Finish button clicked! Current location is:", currentLocation);
    console.log(
      "Finish button clicked! Current exercises to save:",
      currentExercises,
    );

    // Send the data to Supabase using the state App.jsx already has!
    // Send the data to Supabase correctly formatted!
    // Arg 1: An object with the user and location
    // Arg 2: The array of exercises
    // explanation: Supabase is setup currently to expect two arguments.. so we group currentUser and currentLocation into an object to pass as the first argument, and then we pass the exercises array as the second argument.
    const isSaved = await saveWorkoutToCloud(
      { userName: currentUser, location: currentLocation }, 
      currentExercises
    );

    // 2. ONLY show the Summary Screen if the database successfully saved it
    if (isSaved) {
      setIsFinished(true);
    } else {
      // You can replace this with a nice toast notification later!
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
      {currentUser && isWorkoutActive && !isFinished && (
        <WorkoutScreen 
          exercises={currentExercises} 
          onEdit={() => setIsPresetModalOpen(true)} 
          onUpdateExercises={setCurrentExercises} 
          onFinish={handleFinishWorkout}
          currentUser={currentUser}       
          currentLocation={currentLocation}
          // Add a way to cancel the workout and go back to the dashboard!
          onCancel={() => setIsWorkoutActive(false)} 
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
        />
      )}
    </>
  );
}