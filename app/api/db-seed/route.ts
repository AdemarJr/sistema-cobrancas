import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/server"
import bcrypt from "bcrypt"

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    // Verificar se já existe algum usuário
    const { data: usuariosExistentes, error: errorUsuarios } = await supabase.from("usuarios").select("count").single()

    if (errorUsuarios) {
      return NextResponse.json(
        { error: "Falha ao verificar usuários existentes", details: errorUsuarios },
        { status: 500 },
      )
    }

    // Se não existir nenhum usuário, criar um administrador padrão
    if (!usuariosExistentes || usuariosExistentes.count === 0) {
      // Hash da senha
      const senhaHash = await bcrypt.hash("admin123", 10)

      // Inserir usuário administrador
      const { error: errorInsert } = await supabase.from("usuarios").insert({
        nome: "Administrador",
        email: "admin@exemplo.com",
        senha: senhaHash,
        perfil: "administrador",
        status: true,
      })

      if (errorInsert) {
        return NextResponse.json(
          { error: "Falha ao criar usuário administrador", details: errorInsert },
          { status: 500 },
        )
      }

      return NextResponse.json({ message: "Banco de dados inicializado e usuário administrador criado com sucesso" })
    }

    return NextResponse.json({ message: "Banco de dados já possui usuários cadastrados" })
  } catch (error) {
    console.error("Erro ao processar a requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
