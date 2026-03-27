import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Dumbbell } from "lucide-react";

export default function WelcomeScreen({ onStart }) {
  // Clean default states for the form inputs; input each time to use.
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Guardrail: If either user or location is missing, stop immediately!
    if (!name.trim() || !location.trim()) {
      alert("Please select both a Lifter and a Gym Location!");
      return;
    }

    // If we make it here, both fields are perfectly filled out.
    onStart(name, location);
  };

// --- CONSTANTS (Powered by Environment Variables) ---
  
  // 1. Grab the raw string from Vite, or provide a safe fallback if it fails
  const rawGymString = import.meta.env.VITE_GYM_OPTIONS || "The Gym of Guests";
  const rawUserString = import.meta.env.VITE_USER_OPTIONS || "Guest";

  // 2. Split the string by commas, trim accidental spaces, and map into objects
  const LOCATION_OPTIONS = rawGymString.split(",").map((gym) => {
    const cleanName = gym.trim();
    return { value: cleanName, label: cleanName };
  });

  const USER_OPTIONS = rawUserString.split(",").map((user) => {
    const cleanName = user.trim();
    return { value: cleanName, label: cleanName };
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-zinc-950 text-zinc-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-emerald-500/20 text-emerald-500">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight uppercase">
            progressive overloader
          </h1>
          <p className="mt-2 text-zinc-500">
            Confirm your details to fetch your history.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* USER NAME INPUT */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider uppercase text-zinc-500">
              Lifter Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute w-5 h-5 ml-4 text-zinc-500" />

              <select
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 text-lg font-medium text-white border appearance-none h-14 rounded-xl bg-zinc-900 border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="" disabled hidden>
                  -- Choose a Lifter --
                </option>

                {USER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* GYM LOCATION SELECTOR */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider uppercase text-zinc-500">
              Gym Location
            </label>
            <div className="relative flex items-center">
              <MapPin className="absolute w-5 h-5 ml-4 text-zinc-500" />

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-12 pr-4 text-lg font-medium text-white border appearance-none h-14 rounded-xl bg-zinc-900 border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="" disabled hidden>
                  -- Choose a Location --
                </option>
                {LOCATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 font-bold transition-colors text-zinc-950 h-14 rounded-xl bg-emerald-500 hover:bg-emerald-400"
          >
            ENTER THE GYM
          </button>
        </form>
      </motion.div>
    </div>
  );
}
