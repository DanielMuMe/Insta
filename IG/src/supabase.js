import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'; 

const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseKey = 'TU_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
export const auth = supabase.auth;