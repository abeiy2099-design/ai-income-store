import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Lead {
  id?: string;
  name: string;
  email: string;
  source?: string;
  created_at?: string;
  updated_at?: string;
}

export async function submitLead(lead: Lead) {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .maybeSingle();

  return { data, error };
}
