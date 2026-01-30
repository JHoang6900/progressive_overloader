import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  MoreVerticalIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";

function MetadataChip({ icon, text }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/60 rounded-lg text-sm">
      <span className="text-zinc-500">{icon}</span>
      <span className="text-zinc-300">{text}</span>
    </div>
  );
}

export function WorkoutHeader({ onEdit }) {
  return (
    <motion.header
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
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
          onClick={onEdit}
        >
          <MoreVerticalIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Metadata Chips */}
      <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
        <MetadataChip
          icon={<ClockIcon className="w-3.5 h-3.5" />}
          text="7:30 PM"
        />
        <MetadataChip
          icon={<MapPinIcon className="w-3.5 h-3.5" />}
          text="MACU-M"
        />
        <MetadataChip
          icon={<UserIcon className="w-3.5 h-3.5" />}
          text="Jeppy"
        />
      </div>
    </motion.header>
  );
}

export default WorkoutHeader;
