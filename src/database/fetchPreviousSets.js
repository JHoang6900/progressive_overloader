import { supabase } from '../supabaseClient'; 

// This function fetches the most recent set data for a given exercise, tailored by user and location when relevant.

export const fetchPreviousSets = async (userName, exerciseName, exerciseType, currentLocation) => {
  try {
    // 1. The Base Query: Find the most recent time this user did this specific exercise
    let query = supabase
      .from('exercises')
      .select(`
        id,
        exercise_name,
        created_at,
        workouts!inner(user_name, location), 
        sets(set_order, weight_display, weight_value, reps)
      `)
      .eq('exercise_name', exerciseName)
      .eq('workouts.user_name', userName)
      .order('created_at', { ascending: false }) // Sort by newest first
      .limit(1); // We only want the absolute latest session

    // 2. The Granular Hybrid Logic! 
    // We check if the exercise type is one that relies on gym pulleys/calibration
    const locationDependentTypes = ['machine', 'cable']; 

    if (locationDependentTypes.includes(exerciseType)) {
      // If it is a machine or cable, strictly filter by the gym you are currently at
      query = query.eq('workouts.location', currentLocation);
    }

    // 3. Execute the query
    const { data, error } = await query.single();

    if (error) throw error;
    
    // 4. Return just the array of sets to be used as our ghost placeholders
    return data?.sets || []; 

  } catch (error) {
    // Supabase throws a harmless error if .single() finds zero rows. 
    // This just means they've never done this exercise (or never at this gym).
    console.log(`No previous history found for ${exerciseName}. Providing blank slate.`);
    return []; 
  }
};


// {* A helper function to fetch PRs  for an exercise *}
export const fetchExercisePRs = async (currentUser, exerciseName) => {
  try {
    const { data, error } = await supabase
      .from('sets')
      .select(`
        weight_value,
        reps,
        exercises!inner (
          exercise_name,
          workouts!inner (
            user_name
          )
        )
      `)
      // 1. Only look at sets that were actually completed
      .eq('completed', true)
      // 2. Filter by the parent table (exercises)
      .eq('exercises.exercise_name', exerciseName)
      // 3. Filter by the grandparent table (workouts)
      .eq('exercises.workouts.user_name', currentUser)
      // 4. Sort by the heaviest weight, then the most reps
      .order('weight_value', { ascending: false })
      .order('reps', { ascending: false })
      // 5. Give us just the all-time best record
      .limit(1)
      .maybeSingle(); // Use maybeSingle() instead of single() so it doesn't throw an error if no PR exists

    if (error) {
      console.error("Error fetching PRs for", exerciseName, error);
      return { maxWeight: 0, maxReps: 0 };
    }

    // If we found a glorious PR, return the numbers!
    // Notice we are using your 'weight_value' number column, which is perfect for math!
    if (data) {
      return { 
        maxWeight: Number(data.weight_value) || 0, 
        maxReps: Number(data.reps) || 0 
      };
    }

    // If you've never done it before, the numbers to beat are 0
    return { maxWeight: 0, maxReps: 0 };

  } catch (error) {
    console.error("Unexpected error fetching PRs:", error);
    return { maxWeight: 0, maxReps: 0 };
  }
};