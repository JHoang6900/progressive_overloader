import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


const calculateWeightValue = (weightDisplay) => {
  if (!weightDisplay) return 0;
  
  // 1. Strip out any letters or spaces (removes "lbs", "kg", etc.)
  // This leaves us with just numbers, decimals, and the plus sign.
  const cleanString = weightDisplay.replace(/[^\d+.-]/g, '');
  
  if (!cleanString) return 0;

  // 2. Split the string at the '+' sign and add the numbers together!
  const total = cleanString.split('+').reduce((sum, currentNumber) => {
    return sum + parseFloat(currentNumber || 0);
  }, 0);

  return total;
};

// Example test: calculateWeightValue("45+15lbs") returns 60

export { calculateWeightValue };
