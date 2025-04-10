import { type NextRequest, NextResponse } from "next/server"
import { autenticarUsuario } from "@/lib/services/usuarios-service"

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json()

    if (!email || !senha) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    const result = await autenticarUsuario(email, senha)

    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json({ error: result.message || "Falha na autenticação" }, { status: 401 })
    }
  } catch (error) {
    console.error("Erro ao processar a requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
