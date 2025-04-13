import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cache } from "react"

// Cria um cliente Supabase para o lado do servidor
export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
})

// Cria um cliente Supabase para o lado do cliente
let clientSupabaseClient: ReturnType<typeof createClient> | null = null

export const createClientSupabaseClient = () => {
  if (clientSupabaseClient) return clientSupabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são necessárias")
  }

  clientSupabaseClient = createClient(supabaseUrl, supabaseKey)
  return clientSupabaseClient
}

// Função para construir consultas paginadas
export function buildPaginatedQuery(
  query: any,
  {
    page = 1,
    pageSize = 10,
    orderBy,
    orderDirection = "asc",
  }: {
    page?: number
    pageSize?: number
    orderBy?: string
    orderDirection?: "asc" | "desc"
  },
) {
  // Adiciona ordenação se especificada
  if (orderBy) {
    query = query.order(orderBy, { ascending: orderDirection === "asc" })
  }

  // Calcula o range para paginação
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // Aplica a paginação
  return query.range(from, to)
}

// Função para buscar o total de registros
export async function getTotalCount(supabase: any, table: string, query?: any) {
  if (query) {
    const { count, error } = await query.count("id", { count: "exact" })
    if (error) throw error
    return count
  }

  const { count, error } = await supabase.from(table).select("id", { count: "exact", head: true })
  if (error) throw error
  return count
}
