import { createClient } from "@supabase/supabase-js"

// Cria um cliente Supabase para uso no lado do servidor
// Usa a chave de serviço que tem permissões completas
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

// Singleton pattern para evitar múltiplas instâncias
let supabaseAdmin: ReturnType<typeof createClient> | null = null

export const getSupabaseAdmin = () => {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  return supabaseAdmin
}
