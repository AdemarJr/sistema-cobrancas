import { getSupabaseAdmin } from "../supabase/server"
import bcrypt from "bcrypt"

export type Usuario = {
  id?: number
  nome: string
  email: string
  senha?: string
  perfil: string
  status: boolean
  ultimo_acesso?: string | null
  data_criacao?: string
}

export async function criarUsuario(usuario: Usuario) {
  const supabase = getSupabaseAdmin()

  try {
    // Hash da senha
    const senhaHash = await bcrypt.hash(usuario.senha || "", 10)

    // Inserir usuário no banco
    const { data, error } = await supabase
      .from("usuarios")
      .insert({
        nome: usuario.nome,
        email: usuario.email,
        senha: senhaHash,
        perfil: usuario.perfil,
        status: usuario.status,
      })
      .select()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return { success: false, error }
  }
}

export async function listarUsuarios() {
  const supabase = getSupabaseAdmin()

  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nome, email, perfil, status, ultimo_acesso, data_criacao")
      .order("nome")

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Erro ao listar usuários:", error)
    return { success: false, error }
  }
}

export async function obterUsuarioPorId(id: number) {
  const supabase = getSupabaseAdmin()

  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nome, email, perfil, status, ultimo_acesso, data_criacao")
      .eq("id", id)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Erro ao obter usuário:", error)
    return { success: false, error }
  }
}

export async function atualizarUsuario(id: number, usuario: Partial<Usuario>) {
  const supabase = getSupabaseAdmin()

  try {
    // Se a senha foi fornecida, fazer o hash
    if (usuario.senha) {
      usuario.senha = await bcrypt.hash(usuario.senha, 10)
    }

    const { data, error } = await supabase.from("usuarios").update(usuario).eq("id", id).select()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    return { success: false, error }
  }
}

export async function excluirUsuario(id: number) {
  const supabase = getSupabaseAdmin()

  try {
    const { error } = await supabase.from("usuarios").delete().eq("id", id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir usuário:", error)
    return { success: false, error }
  }
}

export async function autenticarUsuario(email: string, senha: string) {
  const supabase = getSupabaseAdmin()

  try {
    // Buscar usuário pelo email
    const { data: usuario, error } = await supabase.from("usuarios").select("*").eq("email", email).single()

    if (error) throw error

    if (!usuario) {
      return { success: false, message: "Usuário não encontrado" }
    }

    // Verificar senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

    if (!senhaCorreta) {
      return { success: false, message: "Senha incorreta" }
    }

    // Atualizar último acesso
    await supabase.from("usuarios").update({ ultimo_acesso: new Date().toISOString() }).eq("id", usuario.id)

    // Remover a senha do objeto retornado
    const { senha: _, ...usuarioSemSenha } = usuario

    return { success: true, data: usuarioSemSenha }
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error)
    return { success: false, error }
  }
}
