import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns"; // Import formatting tool
import { cn } from "@/lib/utils"; // Import class merger
import {
  ChevronLeftIcon,
  MoreVerticalIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  CalendarIcon, // Added Calendar Icon
  DumbbellIcon, // Swapped UserIcon for Dumbbell for Activity
} from "lucide-react";

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- CONSTANTS ---
const LOCATION_OPTIONS = [
  { value: "MACU-M", label: "MACU-M" },
  { value: "MACU-T", label: "MACU-T" },
  { value: "EOS SJ", label: "EOS SJ" },
  { value: "EOS TV", label: "EOS TV" },
];

const USER_OPTIONS = [
  { value: "JHoang", label: "JHoang" },
  { value: "Miss Tang", label: "Miss Tang" },
  { value: "Guest", label: "Guest" },
];

// --- SUB-COMPONENTS ---


// 1. The Simplified Display Chip (Replaces the Dropdown!)
function MetadataChip({ icon, value }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/60 rounded-lg text-sm text-zinc-300">
      <span className="text-zinc-500 shrink-0">{icon}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}





// 1. The Reusable Selector (Dropdown)
function MetadataSelector({ icon, value, onChange, options, label }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
      <span className="text-zinc-500 shrink-0">{icon}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-auto h-8 gap-1 p-0 bg-transparent border-none shadow-none focus:ring-0 text-zinc-300">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent className="bg-zinc-950/90 border-zinc-800 text-zinc-300">
          <SelectGroup>
            <SelectLabel className="text-zinc-500">{label}</SelectLabel>
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

// 2. NEW: The Date Picker Component
function WorkoutDatePicker({ date, setDate }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors shrink-0",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-300">
            {date ? format(date, "EEE, MMM d") : <span>Pick a date</span>}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-zinc-950/90 border-zinc-800" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          className="text-zinc-300"
          // These styling props ensure the calendar looks 'Matte Black'
          classNames={{
            day_selected: "bg-zinc-100 text-zinc-900 hover:bg-zinc-100 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900",
            day_today: "bg-zinc-800 text-zinc-50",
            day_outside: "text-zinc-500 opacity-50",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

// --- MAIN COMPONENT ---
export function WorkoutHeader({ onEdit 
  , location, setLocation
  , user, setUser
  , date, setDate, onCancel
}) {
  
  // const [location, setLocation] = useState("MACU-M");
  // const [user, setUser] = useState("JHoang");
  // const [date, setDate] = useState(new Date()); 

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b bg-zinc-950/80 backdrop-blur-xl border-zinc-800/50"
    >
      {/* Top Row: Navigation & Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <button 
        className="flex items-center justify-center w-10 h-10 transition-colors border rounded-xl bg-zinc-900/60 border-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800/60"
        onClick={onCancel}>
        
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-white">
            Full Body Compound
          </h1>
          {/* Dynamic Subtitle based on the selected Date */}
          <p className="text-xs text-zinc-500">
             v2 • {format(date, "MMM d, yyyy")}
          </p>
        </div>

        <button
          className="flex items-center justify-center w-10 h-10 transition-colors border rounded-xl bg-zinc-900/60 border-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          onClick={onEdit}
        >
          <MoreVerticalIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Row: Metadata Chips */}
      <div className="flex items-center justify-center gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
        
        {/* 1. The Date Picker */}
        <WorkoutDatePicker date={date} setDate={setDate} />

        {/* 2. Location */}
        <MetadataChip
          icon={<MapPinIcon className="w-3.5 h-3.5" />}
          value={location} 
        />
        {/* 3. User */}
        <MetadataChip
          icon={<UserIcon className="w-3.5 h-3.5" />}
          value={user} 
        />
      </div>
    </motion.header>
  );
}

export default WorkoutHeader;