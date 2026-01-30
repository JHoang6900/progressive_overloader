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

function ExerciseCard({ exercise, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const completedSets = exercise.sets.length; // For demo purposes, assuming all sets are completed
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
                <div className="pt-4 mt-4 space-y-2 border-t border-zinc-800/50">
                  {exercise.sets.map((set, setIndex) => (
                    <motion.div
                      key={setIndex}
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: setIndex * 0.05,
                      }}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-800/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-zinc-700/50 text-zinc-400">
                          {setIndex + 1}
                        </span>
                        <span
                          className={`text-sm font-medium ${set.isGreen ? "text-emerald-400" : "text-white"}`}
                        >
                          {set.weight}
                        </span>
                      </div>
                      <span
                        className={`text-sm ${set.isRed ? "text-rose-400" : "text-zinc-400"}`}
                      >
                        {set.reps} reps
                      </span>
                    </motion.div>
                  ))}

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

export function WorkoutScreen({ exercises, onEdit }) {
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  return (
    <div className="w-full min-h-screen bg-zinc-950">
      {/* TODO: IMPORT App Header HERE */}
      <WorkoutHeader onEdit={() => onEdit()} />
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
          {exercises.map((exercise, index) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
          ))}
        </div>

        {/* Comments Section */}
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
