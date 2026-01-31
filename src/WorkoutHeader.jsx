import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  MoreVerticalIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  FlameIcon
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



const LOCATION_OPTIONS = [
  { value: "MACU-M", label: "MACU-M" },
  { value: "MACU-T", label: "MACU-T" },
  { value: "EOS SJ", label: "EOS SJ" },
  { value: "EOS TV", label: "EOS TV"}
];

const USER_OPTIONS = [
  { value: "JHoang", label: "JHoang" },
  { value: "Miss Tang", label: "Miss Tang" },
  { value: "Guest", label: "Guest" },
];

const TYPE_OPTIONS = [
  {value: "Strength", label: "Strength"},
  {value: "Cardio", label: "Cardio"},
  {value: "Plyometrics", label: "Plyometrics"},
  {value: "HIIT", label: "HIIT"}
];


// A Reusable Component for ANY dropdown chip
function MetadataSelector({ icon, value, onChange, options, label }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
    
      <span className="text-zinc-500 shrink-0">{icon}</span>

      {/* The Select Component */}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-auto h-8 gap-1 p-0 bg-transparent border-none shadow-none focus:ring-0 text-zinc-300">
            {/* background transparent is nice for consistent theme */}
          <SelectValue placeholder={label} />
        </SelectTrigger>
        
        {/* The Dropdown Menu */}
        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
          <SelectGroup>
            <SelectLabel className="text-zinc-500">{label}</SelectLabel>
            {/* MAPPING LOGIC */}
            {options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="cursor-pointer focus:bg-zinc-800 focus:text-white"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export function WorkoutHeader({ onEdit }) {

    const [location, setLocation] = useState("MACU-M");
    const [user, setUser] = useState("JHoang");
    const [type, setType] = useState("Strength");


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
        <button className="flex items-center justify-center w-10 h-10 transition-colors border rounded-xl bg-zinc-900/60 border-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800/60" label="Back Button">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <div className="text-center" label="Workout Title and Date">
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

      {/* Metadata Chips Row */}
      <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
        
        {/* TODO: Static Time Chip  */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 shrink-0">
           <ClockIcon className="w-3.5 h-3.5 text-zinc-500" />
           <span>7:30 PM</span>
        </div>

   
        <MetadataSelector 
           icon={<MapPinIcon className="w-3.5 h-3.5" />}
           label="Location"
           options={LOCATION_OPTIONS}
           value={location}
           onChange={setLocation}
        />

 
        <MetadataSelector 
           icon={<UserIcon className="w-3.5 h-3.5" />}
           label="User"
           options={USER_OPTIONS}
           value={user}
           onChange={setUser}
        />


               <MetadataSelector 
           icon={<FlameIcon className="w-3.5 h-3.5" />}
           label="Activity"
           options={TYPE_OPTIONS}
           value={type}
           onChange={setType}
        />

      </div>
    </motion.header>
  );
}

export default WorkoutHeader;
