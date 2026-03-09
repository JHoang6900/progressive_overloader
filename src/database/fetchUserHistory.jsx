// Adjust this import path if your supabaseClient is in a different folder!
import { supabase } from '../supabaseClient'; 

export const fetchUserHistory = async (userName) => {
  try {
    console.log(`Fetching workout history for ${userName}...`);

    // The Supabase Nested Query
    const { data, error } = await supabase
      .from('workouts')
      .select(`
        id,
        created_at,
        location,
        exercises (
          id,
          exercise_name,
          icon,
          sets (
            set_order,
            weight_display,
            reps,
            completed,
            is_pr
          )
        )
      `)
      .eq('user_name', userName)
      .order('created_at', { ascending: false }); // Newest workouts first!

    if (error) throw error;
    
    console.log("History fetched successfully:", data);

      return data.map(workout => ({
    ...workout,
    hasPR: workout.exercises.some(ex => 
      ex.sets.some(set => set.is_pr === true)
    )
  }));

  } catch (error) {
    console.error("❌ Error fetching history:", error.message);
    return []; // Return an empty array if it fails so the UI doesn't crash
  }
};








