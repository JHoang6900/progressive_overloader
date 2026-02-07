import React, { useState } from "react";
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
} from "lucide-react";

import WorkoutHeader from "./WorkoutHeader.jsx";
import { EXERCISE_HISTORY } from "./data/mockHistory.js";

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
        ${align === "right" ? "text-right" : "text-left"}
      `}
    />
  );
}

// ExerciseCard MUST receive 'ghost' and 'onSetChange' as props to use later..
function ExerciseCard({ exercise, index, ghost, onSetChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const completedSets = exercise.sets.length;
  const totalSets = exercise.sets.length;
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
                <div className="pt-4 mt-4 space-y-2 border-t border-zinc-800/50"
                onClick={(e) => e.stopPropagation()}>
                  {exercise.sets.map((set, setIndex) => {
                    // 1. FIND THE MATCHING GHOST SET
                    // We use optional chaining (?.) just in case the history has fewer sets
                    const ghostSet = ghost?.sets?.[setIndex];

                    return (
                      <motion.div
                        key={setIndex}
                        // ... keep existing animation props ...
                        className="flex flex-col gap-1 px-3 py-2 mb-2 rounded-lg bg-zinc-800/30"
                      >
                        {/* --- GHOST HEADER ROW --- */}
                        {ghostSet && (
                          <div className="flex items-end justify-between px-1 mb-1">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                              Set {setIndex + 1}
                            </span>

                             {/* TODO: REFACTOR TO KEEP CODE DRY INSTEAD OF WRITING 2 SPANS */}
                            {ghostSet.isPR ?  <span className="flex items-center text-[10px] text-emerald-400/80 font-mono">
                                Prev: {ghostSet.weight} x {ghostSet.reps} 🏆
                                </span> 
                                
                                :
                                
                            <span className="text-[10px] text-emerald-400/80 font-mono">
                              Prev: {ghostSet.weight} x {ghostSet.reps}
                            </span>
                            }

                          </div>
                        )}
                        {/* ----------------------------- */}

                        {/* EXISTING INPUT ROW */}
                        <div className="flex items-center justify-between">
                          {/* If no ghost exists, show the set number here like before */}
                          {!ghostSet && (
                            <div className="flex items-center justify-center w-6 h-6 mr-3 text-xs font-medium rounded-full bg-zinc-700/50 text-zinc-400">
                              {setIndex + 1}
                            </div>
                          )}

                          {/* Your Existing Set Data (Weight/Reps) */}
<div className="flex items-center flex-1 gap-3 mr-4">
    <WorkoutInput 
      value={set.weight} 
      //  WEIGHT CHANGE HANDLED BY OnSetChange PASSED FROM PARENT. 
      onChange={(val) => onSetChange(exercise.id, setIndex, 'weight', val)} 
      placeholder="0"
    />
    <span className="text-xs font-medium text-zinc-500">lbs</span>
  </div>

  {/* REPS INPUT */}
  <div className="flex items-center w-20">
    <WorkoutInput 
      value={set.reps} 
      //  REPS CHANGE HANDLED BY OnSetChange PASSED FROM PARENT. 
       onChange={(val) => onSetChange(exercise.id, setIndex, 'reps', val)} 
      placeholder="0"
      align="right"
    />
    <span className="text-xs text-zinc-500 font-medium ml-1.5">reps</span>
  </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {exercise.notes && (
                    <motion.div
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      transition={{
                        delay: exercise.sets.length * 0.05,
                      }}
                      className="p-3 mt-3 border rounded-lg bg-zinc-800/20 border-zinc-700/30"
                    >
                      <p className="text-sm text-zinc-400">
                        <span className="text-zinc-500">Note:</span>{" "}
                        {exercise.notes}
                      </p>
                    </motion.div>
                  )}
                </div>
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

export function WorkoutScreen({ exercises, onEdit, onUpdateExercises }) {
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const [location, setLocation] = useState("MACU-M");
  const [user, setUser] = useState("JHoang");
  const [date, setDate] = useState(new Date());

  const getGhostData = (exerciseId) => {
    const locationHistory = EXERCISE_HISTORY[location];
    console.log("Location History ~>", locationHistory);
    if (!locationHistory) return null;

    // returns the whole object (sets, notes, date, etc.)
    console.log("locationHistory[exerciseId] ~>", locationHistory[exerciseId]);
    return locationHistory[exerciseId] || null;
    
  };


  const handleUpdateSet = (exerciseId, setIndex, field, newValue) => {
    const updatedExercises = exercises.map((ex) => {
      // Is this the exercise we are looking for?
      if (ex.id === exerciseId) {
        // Yes. Now find the specific set.
        const updatedSets = ex.sets.map((set, i) => {
          if (i === setIndex) {
            // FOUND IT! Update 'weight' or 'reps'
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

  return (
    <div className="w-full min-h-screen bg-zinc-950">
      {/* TODO: IMPORT App Header HERE */}
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
            const ghostData = getGhostData(exercise.id);

            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                // 2. PASS THE DATA DOWN
                ghost={ghostData}
                onSetChange={handleUpdateSet}
              />
            );
          })}
        </div>

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
      <motion.button
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
      </motion.button>
    </div>
  );
}
export default WorkoutScreen;
