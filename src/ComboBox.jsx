import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react" 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// 1. Define your list of exercises here
const exercises = [
  { value: "barbell benchpress", label: "Barbell Benchpress" },
  { value: "dumbbell bench press", label: "Dumbbell Bench Press" },
  { value: "pull-ups", label: "Pull-Ups" },
  { value: "squat", label: "Squat" },
]

export function Combobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    // 2. We use Popover as the "wrapper"
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? exercises.find((exercise) => exercise.value === value)?.label
            : "Select exercise..."}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[200px] p-0 text-white bg-zinc-900">
        {/* 3. We use Command for the search functionality */}
        <Command>
          <CommandInput placeholder="Search exercise..." />
          <CommandList>
            <CommandEmpty>No exercise found.</CommandEmpty>
            <CommandGroup>
              {exercises.map((exercise) => (
                <CommandItem
                  key={exercise.value}
                  value={exercise.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === exercise.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {exercise.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox;







// COMBOBOX EDITABLE STYLING: 
//  {isBadge ? (
//         <span className="px-3 py-1 text-sm font-medium text-white rounded-lg bg-zinc-800/80">
//           {value}
//         </span>
//       ) : (
//         <span className="text-sm text-white">{value}</span>
//       )}