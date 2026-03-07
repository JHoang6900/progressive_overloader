import { supabase } from '../supabaseClient'; 
import { calculateWeightValue } from '../lib/utils';

export const saveWorkoutToCloud = async (workoutMetadata, exercisesArray) => {
  // Only ONE try block to start the process
  try {
    console.log("Starting cloud save...");

    // 1. Guardrail announces if missing data
    if (!workoutMetadata?.location || !workoutMetadata?.userName) {
      throw new Error("Missing User or Location data! Aborting save to prevent dirty data.");
    }

    // 2. INSERT PARENT (WORKOUT)
    const { data: workoutData, error: workoutError } = await supabase
      .from('workouts')
      .insert([{
        // Strict mapping only!
        location: workoutMetadata.location,
        user_name: workoutMetadata.userName,
      }])
      .select()
      .single();

    if (workoutError) throw workoutError;
    const newWorkoutId = workoutData.id;

    // 3. INSERT CHILDREN (EXERCISES)
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

      // 4. INSERT GRANDCHILDREN (SETS)
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

  // ONE catch block to catch any errors from above
  } catch (error) {
    console.error("❌ Error saving workout:", error.message);
    return false; 
  }
};