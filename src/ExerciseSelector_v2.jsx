import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Combobox } from "@/components/ui/combobox";
import { ALL_EXERCISES, REP_RANGES } from "./data/exercises";

import {
  ChevronLeftIcon,
  MoreVerticalIcon,
  PlusIcon,
  ChevronDownIcon,
  DumbbellIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  TargetIcon,
  FlameIcon,
  MessageCircleIcon,
  CircleEllipsis,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";



// switch function for exercise icons
function ExerciseIcon({ type }) {
  const iconClass = "w-5 h-5";
  switch (type) {
    case "dumbbell":
      return <DumbbellIcon className={iconClass} />;
    case "target":
      return <TargetIcon className={iconClass} />;
    case "flame":
      return <FlameIcon className={iconClass} />;
    default:
      return <DumbbellIcon className={iconClass} />;
  }
}

function ExerciseCard({ exercise, index, onUpdateName, onUpdateRepRange, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const completedSets = exercise.sets.length;
  const totalSets = exercise.sets.length;

  const [selectedExercise, setSelectedExercise] = useState(exercise.name);
  const [selectedRepRange, setSelectedRepRange] = useState(exercise.targetReps);

  const badgeStyle = "px-3 py-1 text-sm font-medium rounded-lg bg-zinc-800/80";

  return (
    <div>
      <div className="p-4 mb-3 border bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50 rounded-xl">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/80 text-zinc-300">
              <ExerciseIcon type={exercise.icon} />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className={`${badgeStyle} text-white`}>
                <Combobox
                  items={ALL_EXERCISES}
                  // FIX A: Use the PROP value, not local state
                  // supposedly .tolowerCase() is needed for matching in Combobox
                  value={exercise.name.toLowerCase()}
                  // FIX B: Call the Parent's function, not a local setter
                 onSelect={(newName) => {
                    // 1. Safety check: if they toggle the selection off, don't crash
                    if (!newName) return;

                    // 2. The Lookup: Find the EXACT match in ALL_EXERCISES (case-insensitive)
                    const match = ALL_EXERCISES.find((ex) => {
                      // If it's an object {label, value}, grab the label. If it's a string, grab the string.
                      const textToCompare = typeof ex === "string" ? ex : ex.label;
                      return textToCompare.toLowerCase() === newName.toLowerCase();
                    });

                    // 3. Extract the properly capitalized name from the match
                    const properSpelling = match
                      ? (typeof match === "string" ? match : match.label)
                      : newName;

                    // 4. Update the parent state!
                    onUpdateName(properSpelling);
                  }}
                  placeholder="Select exercise..."
                />
              </h3>
              <p className={`${badgeStyle} text-zinc-500`}>
                <Combobox
                  items={REP_RANGES}
                  // FIX A: Use the PROP value, not local state
                  // supposedly .tolowerCase() is needed for matching in Combobox
                  value={exercise.targetReps.toLowerCase()}
                  // FIX B: Call the Parent's function, not a local setter
                  onSelect={(newRepRange) => onUpdateRepRange(newRepRange)}
                  placeholder="Select Rep Range..."
                />
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {completedSets}/{totalSets}
              </p>
              <p className="text-xs text-zinc-500">sets</p>
            </div>

            {/* TODO: INSERT EDIT ICON HERE */}
            {/* <CircleEllipsis className="w-5 h-5 text-white" /> */}

            {/* DELETE BUTTON */}
            <button 
              onClick={onDelete}
              className="p-2 transition-colors rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
              title="Remove Exercise"
            >
              <Trash2Icon className="w-5 h-5" />
            </button>

            {/* <ChevronDownIcon className="w-5 h-5 text-zinc-500" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExerciseSelector({ exercises, onSave, onCancel }) {
  const [localExercises, setLocalExercises] = useState(exercises);

  const updateExerciseName = (id, newName) => {
    const updated = localExercises.map((ex) =>
      ex.id === id ? { ...ex, name: newName } : ex,
    );
    setLocalExercises(updated);
  };

  const updateExerciseRepRange = (id, newRepRange) => {
    const updated = localExercises.map((ex) =>
      ex.id === id ? { ...ex, targetReps: newRepRange } : ex,
    );
    setLocalExercises(updated);
  };


  const handleAddExercise = () => {
    const newExercise = {
      id: `temp-${Date.now()}`, // Generates a unique temporary ID based on the exact millisecond
      name: "",
      icon: "dumbbell",
      targetReps: "8-10",
      sets: [{ weight: "", reps: "" }], // pre-loads one empty set
    };
    
    // Spread the existing exercises, and tack the new one onto the end!
    setLocalExercises([...localExercises, newExercise]);
  };

  const deleteExercise = (idToRemove) => {
    // .filter() keeps all exercises where the ID does NOT match the one we clicked
    const updated = localExercises.filter((ex) => ex.id !== idToRemove);
    setLocalExercises(updated);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950">
      {/* App Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 border-b bg-zinc-950/80 backdrop-blur-xl border-zinc-800/50"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button className="flex items-center justify-center w-10 h-10 transition-colors border rounded-xl bg-zinc-900/60 border-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800/60">
            <ChevronLeftIcon 
            className="w-5 h-5" 
            onClick={onCancel}
            />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-white">
              Full Body Compound
            </h1>
            <p className="text-xs text-zinc-500">v2 • Jan 21, 2026</p>
          </div>
     <button
            className="flex items-center justify-center w-10 h-10 transition-colors border rounded-xl bg-zinc-900/60 border-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800/60"
            onClick={() => {
              // 1. The Magic Cleanup: Filter out any exercise where the name is empty or just spaces
              const cleanedExercises = localExercises.filter(
                (ex) => ex.name && ex.name.trim() !== ""
              );
              
              // 2. Pass the clean list up to App.jsx!
              onSave(cleanedExercises);
            }}
          >
            <SaveIcon className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-4 py-6 pb-24">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-4"
        >
          <h2 className="text-sm font-medium tracking-wide uppercase text-zinc-400">
            Exercises
          </h2>
          <span className="text-sm text-zinc-600">
            {exercises.length} total
          </span>
        </motion.div>

        {/* Exercise Cards */}
        <div>
          {localExercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                onUpdateName={(newName) =>
                  updateExerciseName(exercise.id, newName)
                }
                 onUpdateRepRange={(newRepRange) =>
                  updateExerciseRepRange(exercise.id, newRepRange)
                }
                onDelete={() => deleteExercise(exercise.id)}


              />
            ),
          )}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleAddExercise}
          className="flex items-center justify-center w-full gap-2 p-4 mt-4 transition-colors border border-dashed rounded-xl bg-zinc-900/40 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800/60 hover:border-zinc-500"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="font-medium">Add Exercise</span>
        </motion.button>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        ></motion.div>
      </main>
    </div>
  );
}

export default ExerciseSelector;
