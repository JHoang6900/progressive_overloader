import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  DumbbellIcon,
  TargetIcon,
  FlameIcon,
  MapPinIcon,
  CalendarIcon,
  CheckCircle2
} from "lucide-react";

// Import the new fetch function we just wrote!
import { fetchWorkoutDetails } from "./database/fetchWorkoutDetails";

// Switch function for exercise icons (kept exactly the same)
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

// Read-Only Stat Card
function StatCard({ icon, value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
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

// Read-Only Exercise Card
function ReadOnlyExerciseCard({ exercise, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const completedSets = exercise.sets.filter(s => s.completed).length;
  const totalSets = exercise.sets.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
    >
      <div className="p-4 mb-3 border bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50 rounded-xl">
        {/* Clickable Header to Toggle */}
        <motion.div
          onClick={() => setIsExpanded(!isExpanded)}
          whileTap={{ scale: 0.98 }}
          className="w-full text-left cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/80 text-zinc-300">
                <ExerciseIcon type={exercise.icon} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">{exercise.name}</h3>
                <p className="text-sm text-zinc-500">Target: {exercise.targetReps} reps</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{completedSets}/{totalSets}</p>
                <p className="text-xs text-zinc-500">sets</p>
              </div>
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDownIcon className="w-5 h-5 text-zinc-500" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Expanded Read-Only Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 space-y-2 border-t border-zinc-800/50">
                {exercise.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className="flex items-center justify-between px-3 py-3 mb-2 rounded-lg bg-zinc-800/30"
                  >
                    {/* Set Number */}
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full ${set.completed ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-700/50 text-zinc-500"}`}>
                        {setIndex + 1}
                      </div>

                      {/* Weight & Reps formatted nicely */}
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-medium text-white">{set.weight || "-"}</span>
                        <span className="text-xs text-zinc-500">lbs</span>
                        <span className="mx-2 text-zinc-600">×</span>
                        <span className="text-lg font-medium text-white">{set.reps || "-"}</span>
                        <span className="text-xs text-zinc-500">reps</span>
                      </div>
                    </div>

                    {/* 🏆 THE GOLDEN TICKET 🏆 */}
                    <div className="flex items-center gap-2">
                      {set.isPR && (
                        <div className="flex items-center gap-1 px-2 py-1 border rounded-md bg-yellow-500/10 border-yellow-500/20">
                          <span className="text-[10px]">🏆</span>
                          <span className="text-[10px] font-bold tracking-tight text-yellow-500 uppercase">PR</span>
                        </div>
                      )}
                      
                      {set.completed && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500/50" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// The Main Screen
export default function WorkoutDetailsScreen({ workoutId, onBack }) {
  const [workout, setWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      setIsLoading(true);
      const data = await fetchWorkoutDetails(workoutId);
      setWorkout(data);
      setIsLoading(false);
    };

    if (workoutId) {
      loadDetails();
    }
  }, [workoutId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-zinc-950">
        <div className="w-8 h-8 border-4 rounded-full border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <p className="text-sm text-zinc-500">Loading workout details...</p>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-zinc-950">
        <p>Workout not found.</p>
        <button onClick={onBack} className="mt-4 text-emerald-500">Go Back</button>
      </div>
    );
  }

  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const prCount = workout.exercises.reduce((acc, ex) => 
    acc + ex.sets.filter(s => s.isPR).length, 0
  );

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 border-b bg-zinc-950/80 backdrop-blur-xl border-zinc-800/50">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 transition-colors border rounded-xl bg-zinc-900/60 border-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-white">Workout Summary</h1>
            <div className="flex items-center justify-center gap-2 mt-0.5 text-xs text-zinc-500">
              <CalendarIcon className="w-3 h-3" />
              {format(parseISO(workout.created_at), "MMM do, yyyy")}
              <span className="text-zinc-700">•</span>
              <MapPinIcon className="w-3 h-3" />
              {workout.location}
            </div>
          </div>
          <div className="w-10" /> {/* Spacer to center the title */}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 pb-24">
        {/* Stats Row */}
        <div className="flex gap-3 mb-6">
          <StatCard
            icon={<DumbbellIcon className="w-4 h-4" />}
            value={workout.exercises.length.toString()}
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
            icon={<span className="text-sm">🏆</span>}
            value={prCount.toString()}
            label="Records"
            delay={0.3}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-4"
        >
          <h2 className="text-sm font-medium tracking-wide uppercase text-zinc-400">
            Exercise Breakdown
          </h2>
        </motion.div>

        {/* Exercise Cards */}
        <div>
          {workout.exercises.map((exercise, index) => (
            <ReadOnlyExerciseCard key={exercise.id} exercise={exercise} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
}