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

function ExerciseCard({ exercise, index, onUpdateName, onUpdateRepRange }) {
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
                  onSelect={(newName) => onUpdateName(newName)}
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

            <ChevronDownIcon className="w-5 h-5 text-zinc-500" />
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
            <ChevronLeftIcon className="w-5 h-5" />
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
              onSave(localExercises);
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


              />
            ),
          )}
        </div>

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
