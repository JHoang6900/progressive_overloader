// src/database/workoutService.js
import { supabase } from '../supabaseClient'; 
import { calculateWeightValue } from '../lib/utils';

export const saveWorkoutToCloud = async (workoutMetadata, exercisesArray) => {
  try {
    console.log("Starting cloud save...");

    // 1. INSERT PARENT (WORKOUT)
    const { data: workoutData, error: workoutError } = await supabase
      .from('workouts')
      .insert([{
        location: workoutMetadata?.location || 'Local Gym',
        user_name: workoutMetadata?.userName || 'Default User',
      }])
      .select()
      .single();

    if (workoutError) throw workoutError;
    const newWorkoutId = workoutData.id;

    // 2. INSERT CHILDREN (EXERCISES)
    for (const exercise of exercisesArray) {
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('exercises')
        .insert([{
          workout_id: newWorkoutId,
          exercise_name: exercise.name, 
          icon: exercise.icon || '',
          target_reps: exercise.targetReps || '',
          notes: exercise.notes || ''
        }])
        .select()
        .single();

      if (exerciseError) throw exerciseError;
      const newExerciseId = exerciseData.id;

      // 3. INSERT GRANDCHILDREN (SETS)
      const setsToInsert = exercise.sets.map((set, index) => ({
        exercise_id: newExerciseId,
        set_order: index + 1, 
        weight_display: set.weight,
        weight_value: calculateWeightValue(set.weight), 
        reps: set.reps,
        completed: set.completed || false
      }));

      if (setsToInsert.length > 0) {
        const { error: setsError } = await supabase
          .from('sets')
          .insert(setsToInsert);

        if (setsError) throw setsError;
      }
    }

    console.log("✅ Workout completely saved to the cloud!");
    return true; 

  } catch (error) {
    console.error("❌ Error saving workout:", error.message);
    return false; 
  }
};