import { supabase } from '../supabaseClient'; 
import { calculateWeightValue } from '../lib/utils';
import { fetchExercisePRs } from './fetchPreviousSets'; 
import { calculatePRs } from '../utils/calculatePRs';

export const saveWorkoutToCloud = async (workoutMetadata, exercisesArray) => {
  try {

    const earnedPRs = [];

    // 1. Guardrail
    if (!workoutMetadata?.location || !workoutMetadata?.userName) {
      throw new Error("Missing User or Location data!");
    }

    // 2. Insert workout
    const { data: workoutData, error: workoutError } = await supabase
      .from('workouts')
      .insert([{
        location: workoutMetadata.location,
        user_name: workoutMetadata.userName,
      }])
      .select()
      .single();

    if (workoutError) throw workoutError;
    const newWorkoutId = workoutData.id;

    // 3. Loop over exercises
    for (const exercise of exercisesArray) {

      // Insert exercise → get newExerciseId
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('exercises')
        .insert([{
          workout_id: newWorkoutId,
          exercise_name: exercise.name,
        }])
        .select()
        .single();

      if (exerciseError) throw exerciseError;
      const newExerciseId = exerciseData.id;

      // 3.5 PR Intercept
      const { maxWeight, maxReps } = await fetchExercisePRs(
        workoutMetadata.userName,
        exercise.name
      );

      const evaluatedSets = calculatePRs(exercise.sets, maxWeight, maxReps);

      // Collect any new PRs for the summary screen
      evaluatedSets.forEach(set => {
        if (set.is_pr) {
          earnedPRs.push({
            exerciseName: exercise.name,
            weight: set.weight,
            reps: set.reps
          });
        }
      });



      // 4. Insert sets
      const setsToInsert = evaluatedSets.map((set, index) => ({
        exercise_id: newExerciseId,
        set_order: index + 1,
        weight_display: set.weight,
        weight_value: calculateWeightValue(set.weight),
        reps: set.reps,
        completed: set.completed || false,
        is_pr: set.is_pr
      }));

      if (setsToInsert.length > 0) {
        const { error: setsError } = await supabase
          .from('sets')
          .insert(setsToInsert);

        if (setsError) throw setsError;
      }
    }

console.log("✅ Workout saved! PRs earned:", earnedPRs);
    
    // 👇 3. Return the bucket of trophies along with the success message!
    return { success: true, prs: earnedPRs };

  } catch (error) {
    console.error("❌ Error saving workout:", error.message);
    return { success: false, prs: [] };
  }
};