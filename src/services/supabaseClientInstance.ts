import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../Constants';
import { Database } from './IDatabase';

export const supabaseClientInstance = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);
