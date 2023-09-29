import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../Constants';

export const supabaseClientInstance: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);
