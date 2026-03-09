export const calculatePRs = (todaySets, historicalMaxWeight = 0, historicalMaxReps = 0) => {
  let recordWeight = Number(historicalMaxWeight);
  let recordReps = Number(historicalMaxReps);

  return todaySets.map(set => {
    // If they didn't complete the set, it can't be a PR
    if (!set.completed) {
      return { ...set, is_pr: false };
    }

    const currentWeight = Number(set.weight) || 0; 
    const currentReps = Number(set.reps) || 0;
    let isPR = false;

    // SCENARIO 1: Absolute Weight Record
    if (currentWeight > recordWeight) {
      isPR = true;
      recordWeight = currentWeight; 
      recordReps = currentReps;     
    } 
    // SCENARIO 2: Rep Record at Max Weight
    else if (currentWeight === recordWeight && currentReps > recordReps) {
      isPR = true;
      recordReps = currentReps; 
    }

    // Return the set exactly as it was, but attach the shiny new flag
    return { ...set, is_pr: isPR };
  });
};