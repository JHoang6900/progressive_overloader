import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  MoreVerticalIcon,
  PlusIcon,
  ChevronDownIcon,
  DumbbellIcon,
  ClockIcon,
  TargetIcon,
  FlameIcon,
  MessageCircleIcon,
  Trash2,
  Plus,
  CircleCheckBig,
} from "lucide-react";

import WorkoutHeader from "./WorkoutHeader.jsx";
// import { EXERCISE_HISTORY } from "./data/mockHistory.js";

import { fetchPreviousSets } from "./database/fetchPreviousSets.js";
import { ALL_EXERCISES } from "./data/exercises.js";

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
  }
}

function WorkoutInput({ value, onChange, placeholder, align = "left" }) {
  return (
    <input
      type="text" // Keep as text to allow "135+5" notations if you want
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`
        w-full bg-transparent border-b border-transparent 
        focus:border-emerald-500 focus:outline-none 
        text-white font-medium text-lg p-0
        placeholder:text-zinc-700
        ${align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}

      `}
    />
  );
}

// ExerciseCard MUST receive 'ghost' and 'onSetChange' as props to use later..
function ExerciseCard({
  exercise,
  index,
  ghost,
  onSetChange,
  onAddSet,
  onRemoveSet,
  historicalData,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const completedSets = exercise.sets.length;
  const totalSets = exercise.sets.length;




// 🌟 AUTO-GREEN CHECKER 🌟
  useEffect(() => {
    // Loop through all the sets for this specific exercise
    exercise.sets.forEach((set, setIndex) => {
      
      // Check if both fields have at least one character typed in them
      const hasWeight = set.weight && set.weight.toString().trim() !== "";
      const hasReps = set.reps && set.reps.toString().trim() !== "";

      // Condition 1: If both are filled, and it's NOT green yet... turn it green!
      if (hasWeight && hasReps && !set.completed) {
        onSetChange(exercise.id, setIndex, "completed", true);
      }
      
      // Condition 2: If they delete a value, and it IS green... uncheck it automatically!
      else if ((!hasWeight || !hasReps) && set.completed) {
        onSetChange(exercise.id, setIndex, "completed", false);
      }
    });
  }, [exercise.sets, exercise.id, onSetChange]); // the watcher runs every time a set changes


  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.08,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
        whileTap={{
          scale: 0.98,
        }}
      >
        <div className="p-4 mb-3 border bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50 rounded-xl">
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/80 text-zinc-300">
                <ExerciseIcon type={exercise.icon} />
              </div>
              <div>
                {/* <h3 className="text-base font-semibold text-white">
                  {exercise.name}
                </h3> */}

                <h3 className="text-sm font-medium text-white ">
                  {exercise.name}
                </h3>

                <p className="text-sm text-zinc-500">
                  Target: {exercise.targetReps} reps
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

              <motion.div
                animate={{
                  rotate: isExpanded ? 180 : 0,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <ChevronDownIcon className="w-5 h-5 text-zinc-500" />
              </motion.div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 mt-3 overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              className="h-full bg-gradient-to-r from-zinc-500 to-zinc-400"
              initial={{
                width: 0,
              }}
              animate={{
                width: `${(completedSets / totalSets) * 100}%`,
              }}
              transition={{
                delay: index * 0.08 + 0.3,
                duration: 0.6,
                ease: "easeOut",
              }}
            />
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="overflow-hidden"
              >
                <div
                  className="pt-4 mt-4 space-y-2 border-t border-zinc-800/50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {exercise.sets.map((set, setIndex) => {
                    // 1. SINGLE SOURCE OF TRUTH: Find the history for this exact row
                    const previousSet = historicalData[exercise.id]?.[setIndex];
                    return (
                      <motion.div
                        key={setIndex}
                        className="flex flex-col gap-1 px-3 py-2 mb-2 rounded-lg bg-zinc-800/30"
                      >
                        {/* --- GHOST HEADER ROW --- */}
                        {previousSet && (
                          <div className="flex items-end justify-between px-1 mb-1">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                              Set {setIndex + 1}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400/80 font-mono">
                              Prev: {previousSet.weight_display} x{" "}
                              {previousSet.reps}
                              {previousSet.isPR && <span>🏆</span>}
                            </span>
                          </div>
                        )}
                        {/* ----------------------------- */}

                        {/* EXISTING INPUT ROW */}
                        <div className="flex items-center justify-between h-8">
                          {/* 1. THE SET NUMBER / CHECKMARK (WITH MASSIVE HITBOX) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!set.completed && !set.weight && !set.reps) {
                                return;
                              }
                              onSetChange(
                                exercise.id,
                                setIndex,
                                "completed",
                                !set.completed,
                              );
                            }}
                            // 👇 an invisible massive wrapper! (p-3 adds padding, -ml-3 pulls it left so UI doesn't break) -- increases the hitbox to make it easier to click without breaking UI.
                            className="p-4 mr-1 -ml-4 outline-none cursor-pointer group" // border border-red-700 to visually see.
                          >
                            <div
                              className={`flex items-center justify-center w-6 h-6 shrink-0 text-xs font-medium rounded-full transition-colors ${
                                set.completed
                                  ? "bg-emerald-500 text-zinc-900"
                                  : "bg-zinc-700/50 text-zinc-400 group-hover:bg-zinc-600/50"
                              }`}
                            >
                              {set.completed ? (
                                <CircleCheckBig className="w-3.5 h-3.5" />
                              ) : (
                                setIndex + 1
                              )}
                            </div>
                          </button>

                          {/* 2. THE WEIGHT INPUT */}
                          <div className="flex items-center flex-1 gap-3 px-3 py-2 mr-4">
                            <div
                              className={` px-3 py-2 rounded-lg border transition-colors ${
                                set.completed
                                  ? "bg-emerald-800/40 border-emerald-500/30"
                                  : "bg-zinc-800/30 border-transparent hover:bg-zinc-800/50"
                              }`}
                              onClick={(event) => event.stopPropagation()}
                            >
                              <WorkoutInput
                                value={set.weight}
                                onChange={(value) =>
                                  onSetChange(
                                    exercise.id,
                                    setIndex,
                                    "weight",
                                    value,
                                  )
                                }
                                placeholder={
                                  previousSet
                                    ? previousSet.weight_display
                                    : "Weight"
                                }
                              />
                            </div>
                            <span
                              className={`text-xs font-medium ${set.completed ? "text-emerald-500" : "text-zinc-500"}`}
                            >
                              lbs
                            </span>
                          </div>

                          {/* 3. THE REPS INPUT */}
                          <div className="flex items-center w-20 gap-2 shrink-0">
                            <div
                              className={`flex-1 px-2 py-2 rounded-lg border transition-colors ${
                                set.completed
                                  ? "bg-emerald-800/40 border-emerald-500/30"
                                  : "bg-zinc-800/30 border-transparent hover:bg-zinc-800/50"
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <WorkoutInput
                                value={set.reps}
                                onChange={(val) =>
                                  onSetChange(
                                    exercise.id,
                                    setIndex,
                                    "reps",
                                    val,
                                  )
                                }
                                placeholder={
                                  previousSet ? previousSet.reps : "Reps"
                                }
                                align="center"
                              />
                            </div>
                            <span
                              className={`text-xs font-medium shrink-0 ${set.completed ? "text-emerald-500" : "text-zinc-500"}`}
                            >
                              reps
                            </span>
                          </div>

                          {/* 4. THE TRASH BUTTON */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveSet(exercise.id, setIndex);
                            }}
                            className="p-4 ml-3 transition-colors border border-red-500 rounded-md shrink-0 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 group group-hover" // border border-red-500
                          >
                            <Trash2 className="w-3.5 h-3.5 pointer-events-none" /> {/* // pointer-events-none makes sure the icon itself doesn't interfere with the button's click area hitbox. */}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* ADD SET BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the card from accidentally collapsing
                    onAddSet(exercise.id);
                  }}
                  className="w-full py-2 mt-3 text-sm font-medium transition-colors rounded-lg text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20"
                >
                  + Add Set
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </motion.div>
  );
}
function StatCard({ icon, value, label, delay }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        delay,
        duration: 0.4,
      }}
      className="flex-1 p-4 border bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50 rounded-xl"
    >
      <div className="flex items-center gap-2 mb-1 text-zinc-500">
        {icon}
        <span className="text-xs tracking-wide uppercase">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </motion.div>
  );
}

export function WorkoutScreen({
  exercises,
  onEdit,
  onUpdateExercises,
  onFinish,
}) {
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const [location, setLocation] = useState("MACU-M");
  const [user, setUser] = useState("JHoang");
  const [date, setDate] = useState(new Date());

  // const getGhostData = (exerciseId) => {
  //   const locationHistory = EXERCISE_HISTORY[location];
  //   console.log("Location History ~>", locationHistory);
  //   if (!locationHistory) return null;

  //   // returns the whole object (sets, notes, date, etc.)
  //   console.log("locationHistory[exerciseId] ~>", locationHistory[exerciseId]);
  //   return locationHistory[exerciseId] || null;
  // };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 1. Create a dictionary to hold our ghost data.
  // It will look like: { "fbc-1": [{ weight_display: "135lbs", reps: "10" }] }
  const [historicalData, setHistoricalData] = useState({});

  // 2. The Background Fetcher
  useEffect(() => {
    const loadGhostSets = async () => {
      // Create a copy of whatever ghost data we already have
      const newGhostData = { ...historicalData };
      let hasNewData = false;

      // Loop through the active exercises
      for (const exercise of exercises) {

// If it's a blank template row/unnamed exercise, skip the supabase call.
if (!exercise.name || exercise.name === "") continue;

        // If we already fetched the history for this specific exercise card, skip it!
        if (newGhostData[exercise.id]) continue;

        // Look up the exercise type (freeweight vs machine) from our master list
        const exerciseDef = ALL_EXERCISES.find(
          (ex) => (typeof ex === "string" ? ex : ex.label) === exercise.name,
        );
        const exerciseType = exerciseDef?.type || "freeweight"; // Fallback just in case

        // Fetch from Supabase! (Using your hardcoded MVP details for now)
        const history = await fetchPreviousSets(
          "JHoang", // Your User ID
          exercise.name, // e.g., "Barbell Benchpress"
          exerciseType, // e.g., "freeweight"
          "MACU-M", // Your current gym location
        );

        console.log(`Supabase returned this for ${exercise.name}:`, history);

        // Save the history to our dictionary under this exercise's unique ID
        newGhostData[exercise.id] = history;
        hasNewData = true;
      }

      // If we found new history, update the React state so the UI re-renders!
      if (hasNewData) {
        setHistoricalData(newGhostData);
      }
    };

    loadGhostSets();
  }, [exercises]); // This runs every time the 'exercises' array changes

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleUpdateSet = (exerciseId, setIndex, field, newValue) => {
    const updatedExercises = exercises.map((ex) => {
      // Is this the exercise we are looking for?
      if (ex.id === exerciseId) {
        // Yes. Now find the specific set.
        const updatedSets = ex.sets.map((set, i) => {
          if (i === setIndex) {
            // located, now Update 'weight' or 'reps' based on 'field' parameter
            return { ...set, [field]: newValue };
          }
          return set;
        });
        return { ...ex, sets: updatedSets };
      }
      return ex; // Not the one, keep it the same.
    });
    onUpdateExercises(updatedExercises);
  };

  // 1. ADD SET LOGIC
  const handleAddSet = (exerciseId) => {
    const updatedExercises = exercises.map((ex) => {
      if (ex.id === exerciseId) {
        // Create a new empty set
        const previousSet = ex.sets[ex.sets.length - 1];
        const newSet = {
          weight: previousSet ? previousSet.weight : "", // Copy weight or empty to save typing
          reps: "", // Copy reps or empty use: "previousSet ? previousSet.reps :" if we need to swap back to copying reps as well.
          completed: false,
        };

        return { ...ex, sets: [...ex.sets, newSet] }; // Add to end
      }
      return ex;
    });
    onUpdateExercises(updatedExercises);
  };

  // 2. REMOVE SET LOGIC
  const handleRemoveSet = (exerciseId, setIndex) => {
    const updatedExercises = exercises.map((ex) => {
      if (ex.id === exerciseId) {
        // Filter out the set at specific index. For the most part, try using filter instead of splice/creating new arrays in React.
        const updatedSets = ex.sets.filter((_, i) => i !== setIndex);
        return { ...ex, sets: updatedSets };
      }
      return ex;
    });
    onUpdateExercises(updatedExercises);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950">
      <WorkoutHeader
        onEdit={() => onEdit()}
        location={location}
        user={user}
        date={date}
        setLocation={setLocation}
        setUser={setUser}
        setDate={setDate}
      />
      {/* Main Content */}
      <main className="px-4 py-6 pb-24">
        {/* Stats Row */}
        <div className="flex gap-3 mb-6">
          <StatCard
            icon={<DumbbellIcon className="w-4 h-4" />}
            value={exercises.length.toString()}
            label="Exercises"
            delay={0.1}
          />
          <StatCard
            icon={<TargetIcon className="w-4 h-4" />}
            value={totalSets.toString()}
            label="Total Sets"
            delay={0.2}
          />
          <StatCard
            icon={<ClockIcon className="w-4 h-4" />}
            value="45m"
            label="Duration"
            delay={0.3}
          />
        </div>

        {/* Section Header */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.3,
          }}
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
          {exercises.map((exercise, index) => {
            // 1. CALL THE FUNCTION
            // calculate the specific history for this exercise ID
            // const ghostData = getGhostData(exercise.id);

            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                // 2. PASS THE DATA DOWN
                // ghost={ghostData}
                onSetChange={handleUpdateSet}
                onAddSet={handleAddSet}
                onRemoveSet={handleRemoveSet}
                historicalData={historicalData}
              />
            );
          })}
        </div>

        {/* FIXED BOTTOM BAR */}
        <div className="bottom-0 left-0 right-0 p-4 border-t bg-zinc-950/80 backdrop-blur-md border-zinc-800">
          <div className="flex items-center max-w-md gap-4 mx-auto">
            {/* 1. ADD EXERCISE BUTTON (Small, Grey) */}
            <button
              // We'll wire this up later to open your selector
              onClick={() => onEdit()}
              className="flex flex-col items-center justify-center w-16 transition-colors h-14 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
            >
              <PlusIcon className="w-6 h-6" />
              <span className="text-[10px] font-medium mt-0.5">Add</span>
            </button>

            {/* 2. FINISH WORKOUT BUTTON (Big, Green) */}
            <button
              onClick={function () {
                // 1. Package the local state into our metadata object
                const metadata = {
                  location: location,
                  userName: user,
                  date: date,
                };

                // // 2. Call the saveWorkoutToCloud function
                // saveWorkoutToCloud(metadata, exercises);

                onFinish(metadata);
                console.log("Finish Workout Clicked!");
              }}
              className="flex-1 text-lg font-semibold tracking-wide transition-colors shadow-lg h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl shadow-emerald-500/20"
            >
              <div className="flex items-center justify-center">
                <CircleCheckBig className="w-8 h-8" />
                <span className="ml-2">Done</span>
              </div>
            </button>
          </div>
        </div>

        {/* Delete your old 'Floating Action Button' motion.button code blocks 
          since we replaced it with the 'Add' button in the bar above! */}

        {/* (INACTIVE) Comments Section */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
          }}
          className="mt-6"
        >
          <h2 className="mb-3 text-sm font-medium tracking-wide uppercase text-zinc-400">
            Comments
          </h2>
          <div className="p-4 border bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center text-sm font-medium text-white rounded-full w-9 h-9 bg-zinc-800">
                J
              </div>
              <div className="flex-1 bg-zinc-800/40 border border-zinc-700/30 rounded-xl px-4 py-2.5 text-zinc-500 text-sm">
                Add a comment...
              </div>
              <button className="flex items-center justify-center transition-colors rounded-full w-9 h-9 bg-zinc-800/60 text-zinc-400 hover:text-white">
                <MessageCircleIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Floating Action Button */}
      {/* <motion.button
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          delay: 0.8,
          type: "spring",
          stiffness: 200,
        }}
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.95,
        }}
        className="fixed flex items-center justify-center bg-white shadow-lg bottom-6 right-6 w-14 h-14 rounded-2xl text-zinc-900 shadow-black/30"
      >
        <PlusIcon className="w-6 h-6" />
      </motion.button> */}
    </div>
  );
}
export default WorkoutScreen;
