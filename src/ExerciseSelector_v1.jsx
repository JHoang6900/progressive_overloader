import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Combobox from './components/ui/archived/ComboBox'
// import { Combobox } from "@/components/ui/combobox"

import {
  ChevronLeftIcon,
  MoreVerticalIcon,
  PlusIcon,
  ChevronDownIcon,
  DumbbellIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  TargetIcon,
  FlameIcon,
  MessageCircleIcon,
  CircleEllipsis
} from 'lucide-react'



const AllExercisesList = [
  { value: "barbell benchpress", label: "Barbell Benchpress" },
  { value: "dumbbell bench press", label: "Dumbbell Bench Press" },
  { value: "pull-ups", label: "Pull-Ups" },
  { value: "squat", label: "Squat" },
]



const exercises = [
  {
    id: '1',
    name: 'Barbell Benchpress',
    icon: 'dumbbell',
    targetReps: '8-10',
    sets: [
      { weight: '45+15lbs', reps: '5' },
      { weight: '45+15lbs', reps: '5' },
      { weight: '45+15lbs', reps: '5' },
      { weight: '45+15lbs', reps: '4' },
      { weight: '45+15lbs', reps: '4' },
    ],
    notes: '5x5 last 2 sets were 5x4',
  },
  {
    id: '2',
    name: 'Pull-Ups',
    icon: 'target',
    targetReps: '8-10',
    sets: [
      { weight: 'Green', reps: '10', isGreen: true },
      { weight: 'Green', reps: '5 | 3', isGreen: true },
      { weight: 'Green', reps: '5 | 3', isGreen: true },
      { weight: 'Green', reps: '5 | 3', isGreen: true },
    ],
  },
  {
    id: '3',
    name: 'Incline Dumbbell Curl',
    icon: 'dumbbell',
    targetReps: '8-10',
    sets: [
      { weight: '20lbs', reps: '10' },
      { weight: '20lbs', reps: '5' },
      { weight: '15lbs', reps: '10' },
      { weight: '15lbs', reps: '10' },
    ],
  },
  {
    id: '4',
    name: 'Leg Extensions',
    icon: 'flame',
    targetReps: '7-9',
    sets: [
      { weight: '85lbs', reps: '10', isRed: true },
      { weight: '100lbs', reps: '10', isRed: true },
      { weight: '100lbs', reps: '10', isRed: true },
      { weight: '100lbs', reps: '10', isRed: true },
    ],
  },
  {
    id: '5',
    name: 'Spread Out',
    icon: 'dumbbell',
    targetReps: '8-10',
    sets: [
      { weight: '75lbs', reps: '7' },
      { weight: '75lbs', reps: '10' },
      { weight: '75lbs', reps: '10' },
      { weight: '75lbs', reps: '10' },
    ],
  },
]

// switch function for exercise icons
function ExerciseIcon({ type }) {
  const iconClass = 'w-5 h-5'
  switch (type) {
    case 'dumbbell':
      return <DumbbellIcon className={iconClass} />
    case 'target':
      return <TargetIcon className={iconClass} />
    case 'flame':
      return <FlameIcon className={iconClass} />
    default:
      return <DumbbellIcon className={iconClass} />
  }
}

function ExerciseCard({ exercise, index }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const completedSets = exercise.sets.length 
  const totalSets = exercise.sets.length

  const [selected, setSelected] = useState(exercise.name);


  const badgeStyle = "px-3 py-1 text-sm font-medium rounded-lg bg-zinc-800/80"
  
  return (

      <div>
        <div className="p-4 mb-3 border bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50 rounded-xl">
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/80 text-zinc-300">
                <ExerciseIcon type={exercise.icon} />
              </div>
              <div className='flex flex-col gap-1'>
                <h3 className={`${badgeStyle} text-white`}>
                  <Combobox />
                </h3>
                <p className={`${badgeStyle} text-zinc-500`}>
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

             
                <ChevronDownIcon className="w-5 h-5 text-zinc-500" />
              </div>
            </div>
          </div>


  
        </div>
 

  )
}



export function ExerciseSelector() {
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0)
  return (
    <div className="w-full min-h-screen bg-zinc-950">
      {/* App Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
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
          <button className="flex items-center justify-center w-10 h-10 transition-colors border rounded-xl bg-zinc-900/60 border-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800/60">
            <MoreVerticalIcon className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-4 py-6 pb-24">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
        </motion.div>
      </main>
    </div>
  )
}

export default ExerciseSelector







// COMBOBOX EDITABLE STYLING: 
//  {isBadge ? (
//         <span className="px-3 py-1 text-sm font-medium text-white rounded-lg bg-zinc-800/80">
//           {value}
//         </span>
//       ) : (
//         <span className="text-sm text-white">{value}</span>
//       )}