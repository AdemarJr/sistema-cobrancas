import { type NextRequest, NextResponse } from "next/server"
import { obterUsuarioPorId, atualizarUsuario, excluirUsuario } from "@/lib/services/usuarios-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const result = await obterUsuarioPorId(id)

    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }
  } catch (error) {
    console.error("Erro ao processar a requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const usuario = await request.json()

    const result = await atualizarUsuario(id, usuario)

    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json({ error: "Falha ao atualizar usuário", details: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Erro ao processar a requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const result = await excluirUsuario(id)

    if (result.success) {
      return NextResponse.json({ message: "Usuário excluído com sucesso" })
    } else {
      return NextResponse.json({ error: "Falha ao excluir usuário", details: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Erro ao processar a requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
