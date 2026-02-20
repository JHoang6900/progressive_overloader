import React, { useEffect, useState } from "react";
import Confetti from "react-confetti"; 
import { motion } from "framer-motion";
import { Trophy, Dumbbell, Home, Share2, Flame } from "lucide-react";

const getVolumeFlavor = (pounds) => {
  if (pounds < 1000) return "That's about 1 Grand Piano! 🎹";
  if (pounds < 3000) return "That's a whole Honda Civic! 🚗";
  if (pounds < 5000) return "That's a Rhinoceros! 🦏";
  if (pounds < 10000) return "That's a Monster Truck! 🚛";
  if (pounds < 20000) return "That's a T-Rex! 🦖";
  return "That's a Space Shuttle! 🚀";
};

export default function SummaryScreen({ exercises, onClose }) {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalVolume = exercises.reduce((acc, ex) => {
    const exerciseVolume = ex.sets.reduce((setAcc, set) => {
        const weight = parseInt(set.weight) || 0;
        const reps = parseInt(set.reps) || 0;
        return setAcc + (weight * reps);
    }, 0);
    return acc + exerciseVolume;
  }, 0);

  const exercisesCompleted = exercises.filter(ex => ex.sets.some(s => s.completed)).length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-white bg-zinc-950">
      
      {/* CONFETTI LAYER */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} gravity={0.15} />
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative z-10 w-full max-w-md space-y-8 text-center"
      >
        
        {/* HEADER */}
        <div className="space-y-4">
          <motion.div 
            initial={{ y: -20, rotate: -10 }} 
            animate={{ y: 0, rotate: 0 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 text-emerald-400 ring-1 ring-emerald-500/50 shadow-[0_0_60px_RGBA(16,185,129,0.8)]"
          >
            <Trophy className="w-10 h-10 drop-shadow-2xl" />
          </motion.div>
          
          <div>
            <h1 className="text-4xl italic font-black tracking-tighter text-white uppercase drop-shadow-2xl">
              Workout<br/>
              <span className="text-emerald-500">Complete</span>
            </h1>
            <p className="mt-2 font-medium text-zinc-500">Great job, JHoang!</p>
          </div>
        </div>

        {/* HERO STAT: VOLUME & FLAVOR */}
        <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="relative p-6 overflow-hidden border shadow-xl rounded-3xl bg-zinc-900/80 border-zinc-800 backdrop-blur-md"
        >
           {/* Subtle background glow */}
           <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 rounded-full bg-emerald-500/10 blur-3xl" />

           <div className="relative z-10">
             <div className="flex items-center justify-center gap-2 mb-3 text-zinc-500">
                <Dumbbell className="w-4 h-4" />
                <span className="text-xs font-bold tracking-widest uppercase">Total Volume</span>
             </div>
             
             <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="font-mono text-5xl font-black tracking-tight text-white">
                  {totalVolume.toLocaleString()}
                </span>
                <span className="text-xl font-medium text-zinc-600">lbs</span>
             </div>

             <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-full bg-zinc-800/50 border-zinc-700/50">
                <span className="text-xs font-medium text-emerald-400">
                  {getVolumeFlavor(totalVolume)}
                </span>
             </div>
           </div>
        </motion.div>

        {/* SECONDARY STATS GRID */}
        <div className="grid grid-cols-2 gap-4">
            {/* Streak Card */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center gap-1 p-4 border rounded-2xl bg-zinc-900/50 border-zinc-800"
            >
                <Flame 
  className="w-6 h-6 mb-1 text-orange-500" 
  style={{ 
    filter: "drop-shadow(0 0 5px rgba(249,115,22, 1)) drop-shadow(0 0 20px rgba(249,115,22, 0.6))" 
  }}
  // glowing neon effect with drop-shadow
/>
                <div className="font-mono text-2xl font-bold text-white">3</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Day Streak</div>
            </motion.div>

            {/* Exercises Card */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center justify-center gap-1 p-4 border rounded-2xl bg-zinc-900/50 border-zinc-800"
            >
          <div className="relative">
  {/* The Icon Glow */}
  <Dumbbell 
    className="w-6 h-6 mb-1 text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" 
  />
  
  {/* Notification Dot (Also Glowing) */}
  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-zinc-900 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
</div>
                <div className="font-mono text-2xl font-bold text-white">{exercisesCompleted}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Exercises</div>
            </motion.div>
        </div>

        {/* CTA BUTTON */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-lg tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          <span>BACK TO HOME</span>
        </motion.button>

      </motion.div>
    </div>
  );
}