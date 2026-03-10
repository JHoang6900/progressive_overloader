import { supabase } from '@/supabaseClient';

export const fetchWorkoutDetails = async (workoutId) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select(`
        id,
        created_at,
        location,
        user_name,
        exercises (
          id,
          exercise_name,
          icon,           
          target_reps,    
          sets (
            id,
            weight_value,
            reps,
            completed,
            is_pr
          )
        )
      `)
      .eq('id', workoutId)
      .single(); // 👈 This is crucial! It tells Supabase we only want ONE object back, not an array.

    if (error) throw error;

    // 👇 MAP THE DATA: Let's format it so your new screen can read it exactly 
    // like your old WorkoutScreen did. No messy data wrangling in the UI!
    const formattedWorkout = {
      ...data,
      exercises: data.exercises.map(ex => ({
        id: ex.id,
        name: ex.exercise_name,
        icon: ex.icon || "dumbbell",
        targetReps: ex.target_reps || "8-10",
        sets: ex.sets
          // Sort sets by ID so they stay in the exact order they were performed
          .sort((a, b) => a.id - b.id) 
          .map(set => ({
            id: set.id,
            weight: set.weight_value,
            reps: set.reps,
            completed: set.completed,
            isPR: set.is_pr // 🏆 Passing the golden ticket!
          }))
      }))
    };

    console.log("Fetched Workout Details:", formattedWorkout);
    return formattedWorkout;

  } catch (error) {
    console.error("❌ Error fetching workout details:", error.message);
    return null;
  }
};