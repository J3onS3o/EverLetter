import { createClient } from '@supabase/supabase-js'

// Use environment variables from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
