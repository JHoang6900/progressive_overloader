import React, { useState } from "react";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { WORKOUT_PRESETS } from "./data/presets.js";

export default function PresetScreen({ onStartPreset, onStartEmpty, onCancel, currentUser }) {
  const [selectedPresetKey, setSelectedPresetKey] = useState("");

  return (
    <div className="flex flex-col w-full min-h-screen p-6 mx-auto bg-zinc-950 text-zinc-50">
      
      {/* Back Button */}
      <div className="pt-4">
        <button 
          onClick={onCancel}
          className="p-2 transition-colors rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col justify-center flex-grow gap-6 pb-20 text-center">
        
       
        <div className="flex flex-col items-center my-3"> 
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-center rounded-full bg-emerald-500/20 text-emerald-500">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight uppercase">
            Ready to lift, 
          </h1>
          <span className="text-3xl font-black tracking-tight uppercase text-emerald-500">
            {currentUser}?! 😱
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <select
            className="w-full p-4 text-lg text-center border outline-none rounded-xl bg-zinc-900 border-zinc-800 focus:ring-2 focus:ring-emerald-500"
            value={selectedPresetKey}
            onChange={(e) => setSelectedPresetKey(e.target.value)}
          >
            <option value="" disabled hidden>
              Choose a workout preset...
            </option>
            {Object.entries(WORKOUT_PRESETS).map(([key, preset]) => (
              <option key={key} value={key}>
                {preset.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              if (selectedPresetKey) {
                const freshWorkout = structuredClone(
                  WORKOUT_PRESETS[selectedPresetKey].exercises
                );
                onStartPreset(freshWorkout);
              }
            }}
            disabled={!selectedPresetKey}
            className="w-full text-lg font-semibold transition-colors h-14 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 rounded-xl"
          >
            Start Preset
          </button>
        </div>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="flex-shrink-0 mx-4 text-sm text-zinc-500">or</span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        <button
          onClick={onStartEmpty}
          className="w-full text-lg font-semibold text-white transition-colors border h-14 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 rounded-xl"
        >
          Start Empty Workout
        </button>
      </div>
    </div>
  );
}



  {/* TODO: add different start phrases like minecraft here  */}