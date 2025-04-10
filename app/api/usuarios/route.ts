import { type NextRequest, NextResponse } from "next/server"
import { criarUsuario, listarUsuarios } from "@/lib/services/usuarios-service"

export async function GET() {
  try {
    const result = await listarUsuarios()

    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json({ error: "Falha ao listar usuários" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro ao processar a requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const usuario = await request.json()

    const result = await criarUsuario(usuario)

    if (result.success) {
      return NextResponse.json(result.data, { status: 201 })
    } else {
      return NextResponse.json({ error: "Falha ao criar usuário", details: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Erro ao processar a requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
