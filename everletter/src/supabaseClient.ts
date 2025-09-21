// supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import { type Database } from './database.types'

// These should be set in your environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create the Supabase client with proper typing
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)