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