import { createClient } from "@supabase/supabase-js"

// Cria um cliente Supabase para uso no lado do cliente
// Usa apenas a chave anônima que é segura para uso no navegador
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Singleton pattern para evitar múltiplas instâncias
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}
