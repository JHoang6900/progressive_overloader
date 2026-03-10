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
      // 👇 Update this call to pass the type and location!
      const { maxWeight, maxReps } = await fetchExercisePRs(
        workoutMetadata.userName,
        exercise.name,
        exercise.type,            // cable/machines are location dependent, freeweights/bodyweight are not
        workoutMetadata.location  // needed to determine if we should apply the location filter when fetching PRs
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
    console.error("❌ Error saving workout to cloud:", error.message);

    // 📦 STASHING: If Supabase fails, we save the payload to localStorage
    try {
      // Package the workout exactly how Supabase will need it later
      const offlinePayload = {
        id: Date.now(), // Give it a temporary unique ID
        workoutMetadata,
        exercisesArray,
        timestamp: new Date().toISOString() // Stamp it so we know when it happened
      };

      // Grab the existing queue (or start a new one)
      const existingQueue = JSON.parse(localStorage.getItem('offline_workout_queue') || '[]');
      
      // Add this workout to the queue and save it back
      existingQueue.push(offlinePayload);
      localStorage.setItem('offline_workout_queue', JSON.stringify(existingQueue));

      console.log("💾 Workout safely stashed in local offline queue.");

      // Return success: true so the UI doesn't crash, but add an 'offline' flag!
      // ( PRs can't be calculated offline, so we return an empty array)
      return { success: true, offline: true, prs: [] };

    } catch (localError) {
      // If even the localStorage fails (e.g., they ran out of phone storage), THEN we hard fail.
      console.error("Fatal Error: Could not save to cloud OR local storage.", localError);
      return { success: false, prs: [] };
    }
  }
};