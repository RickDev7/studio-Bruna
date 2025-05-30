import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = 'https://ddpfougnudxkirmzzsub.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcGZvdWdudWR4a2lybXp6c3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjE4MDcsImV4cCI6MjA2MzkzNzgwN30.MoBgeC2Tevc-t3JJLvU9VFtLABvi9inYPqt8jNyo4Io';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey); 