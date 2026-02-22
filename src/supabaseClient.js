import { createClient } from '@supabase/supabase-js';

// VITE automatically Grabs the variables from the .env file upon startup, so we can directly use them here. No import needed for the .env.local file itself as VITE variables are automatically injected into the client-side code..

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabasePublishableKey);