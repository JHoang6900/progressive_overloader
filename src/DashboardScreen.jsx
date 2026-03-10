import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Plus, Calendar, MapPin, Dumbbell, ArrowLeft } from "lucide-react";

// Adjust this import path depending on where you saved your fetch function!
import { fetchUserHistory } from "./database/fetchUserHistory";

export default function DashboardScreen({ currentUser, onStartWorkout, onBack, onWorkoutClick}) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. The Fetch Effect
  // This runs the moment the Dashboard mounts, grabbing the user's data.
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      const data = await fetchUserHistory(currentUser);
      setHistory(data || []);
      setIsLoading(false);
    };

    loadHistory();
  }, [currentUser]);

  return (
    <div className="flex flex-col w-full min-h-screen pb-24 mx-auto bg-zinc-950 text-zinc-50">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 px-6 py-4 border-b bg-zinc-950/80 backdrop-blur-xl border-zinc-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back Button to return to Welcome Screen */}
            <button 
              onClick={onBack}
              className="p-2 transition-colors rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-sm font-medium text-emerald-500">Welcome back,</p>
              <h1 className="text-xl font-bold text-white">{currentUser}</h1>
            </div>
          </div>
          
          {/* Start Workout Button */}
          <button
            onClick={onStartWorkout}
            className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT FEED --- */}
      <main className="flex-1 p-6 space-y-4">
        <h2 className="text-sm font-bold tracking-wider uppercase text-zinc-500">
          Recent Workouts
        </h2>

        {/* State 1: Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-pulse">
            <div className="w-8 h-8 border-4 rounded-full border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <p className="text-sm text-zinc-500">Loading your history...</p>
          </div>
        )}

        {/* State 2: Empty (No history yet) */}
        {!isLoading && history.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-2xl bg-zinc-900/30 border-zinc-800"
          >
            <Dumbbell className="w-12 h-12 mb-3 text-zinc-600" />
            <h3 className="text-lg font-medium text-white">No workouts yet</h3>
            <p className="mt-1 text-sm text-zinc-500">Time to hit the gym and log your first session!</p>
          </motion.div>
        )}

        {/* State 3: The Workout Feed */}
        {!isLoading && history.length > 0 && (
          <div className="space-y-4">
            {history.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }} // Staggers the card animations!
                className="p-4 transition-colors border cursor-pointer rounded-2xl bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-900 hover:bg-zinc-800/50"
                onClick={() => onWorkoutClick(workout.id)}
              >
               {/* Card Header: Date & Location */}
<div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
  <div className="flex items-center gap-2 text-sm font-medium text-white">
    <Calendar className="w-4 h-4 text-emerald-500" />
    {format(parseISO(workout.created_at), "EEEE, MMM do")}
  </div>

  {/* 👇 NEW: Combined Badge & Location Container */}
  <div className="flex items-center gap-3">
    {/* 🏆 THE PR BADGE */}
    {workout.hasPR && (
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.05)]">
        <span className="text-[10px]">🏆</span>
        <span className="text-[10px] font-bold tracking-tight text-yellow-500 uppercase">PR</span>
      </div>
    )}

    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
      <MapPin className="w-3.5 h-3.5" />
      {workout.location}
    </div>
  </div>
</div>

                {/* Card Body: Exercise Summary */}
                <div className="space-y-2">
                  {/* We safely map over the exercises array fetched from Supabase */}
                  {workout.exercises?.map((exercise) => {
                    // Quick math to find out how many sets were actually completed
                    const completedSets = exercise.sets?.filter(s => s.completed).length || 0;
                    const totalSets = exercise.sets?.length || 0;

                    return (
                      <div key={exercise.id} className="flex items-center justify-between text-sm">
                        <span className="text-zinc-300">{exercise.exercise_name}</span>
                        <span className="text-xs font-medium text-zinc-500">
                          {completedSets} / {totalSets} sets
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}