import { getSupabaseAdmin } from "../supabase/server"

export type Cliente = {
  id?: number
  nome: string
  cpf_cnpj: string
  telefone?: string
  email?: string
  data_nascimento?: string
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  informacoes_adicionais?: string
  data_cadastro?: string
}

export async function criarCliente(cliente: Cliente) {
  const supabase = getSupabaseAdmin()

  try {
    const { data, error } = await supabase.from("clientes").insert(cliente).select()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
    return { success: false, error }
  }
}

export async function listarClientes() {
  const supabase = getSupabaseAdmin()

  try {
    const { data, error } = await supabase.from("clientes").select("*").order("nome")

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Erro ao listar clientes:", error)
    return { success: false, error }
  }
}

export async function obterClientePorId(id: number) {
  const supabase = getSupabaseAdmin()

  try {
    const { data, error } = await supabase.from("clientes").select("*").eq("id", id).single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Erro ao obter cliente:", error)
    return { success: false, error }
  }
}

export async function atualizarCliente(id: number, cliente: Partial<Cliente>) {
  const supabase = getSupabaseAdmin()

  try {
    const { data, error } = await supabase.from("clientes").update(cliente).eq("id", id).select()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error)
    return { success: false, error }
  }
}

export async function excluirCliente(id: number) {
  const supabase = getSupabaseAdmin()

  try {
    const { error } = await supabase.from("clientes").delete().eq("id", id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir cliente:", error)
    return { success: false, error }
  }
}

export async function buscarClientes(termo: string) {
  const supabase = getSupabaseAdmin()

  try {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .or(`nome.ilike.%${termo}%,cpf_cnpj.ilike.%${termo}%,email.ilike.%${termo}%`)
      .order("nome")

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Erro ao buscar clientes:", error)
    return { success: false, error }
  }
}
