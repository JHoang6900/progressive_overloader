-- 1. Create the Workouts Table
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  location VARCHAR(100), -- Max 100 characters
  user_name VARCHAR(50) NOT NULL, -- Max 50 characters, cannot be empty
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 2. Create the Exercises Table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL, -- Must belong to a workout
  exercise_name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  target_reps VARCHAR(50),
  notes VARCHAR(1000), -- sufficient room for notes, but cap it at 1000 chars
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 3. Create the Sets Table
CREATE TABLE sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL, -- Must belong to an exercise ofc
  set_order INTEGER NOT NULL CHECK (set_order > 0), -- Must be set 1, 2, 3, etc.
  weight_display VARCHAR(50), 
  weight_value DECIMAL(6, 2) CHECK (weight_value >= 0), -- Up to 9999.99, no negatives!
  reps DECIMAL(5, 2) CHECK (reps >= 0),                 -- No negative reps?
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);


-- THIS GOES INTO SUPABASE. NOT USED IN IDE.