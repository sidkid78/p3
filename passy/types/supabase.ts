// Generate this file with:
// supabase gen types typescript --local > src/types/supabase.ts
// or
// supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Your tables will be generated here
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
