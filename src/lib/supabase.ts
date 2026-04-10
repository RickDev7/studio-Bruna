import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

/** Mesmos placeholders que `@/config/supabase-client` — evita falhar o build sem env. */
const BUILD_PLACEHOLDER_URL = 'https://placeholder.supabase.co'
const BUILD_PLACEHOLDER_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDI1OTUyMDAsImV4cCI6MTk1ODE3MTIwMH0.invalid'

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || BUILD_PLACEHOLDER_URL
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  BUILD_PLACEHOLDER_ANON_KEY

export const supabase = createClient<Database>(url, key)