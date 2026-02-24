-- 1. Create the Workouts Table (The Parent)
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  location TEXT,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 2. Create the Exercises Table (The Child)
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  icon TEXT,
  target_reps TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 3. Create the Sets Table (The Grandchild)

CREATE TABLE sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  set_order INTEGER NOT NULL,
  weight_display TEXT,      -- Stores "45+15lbs" for your visual plate math
  weight_value NUMERIC, -- Stores 60 for your charts and graphs
  reps TEXT,              -- (We can leave reps as TEXT for now if you log things like "5 | 3")
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);