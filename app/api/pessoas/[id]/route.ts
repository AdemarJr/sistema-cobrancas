import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("pessoas")
      .select(`
        *,
        emprestimos:emprestimos(
          *,
          cobrancas:cobrancas(*)
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Pessoa não encontrada" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao buscar pessoa:", error)
    return NextResponse.json({ error: "Erro ao buscar pessoa" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = createServerSupabaseClient()

    // Verificar se a pessoa existe
    const { data: pessoaExistente } = await supabase.from("pessoas").select("cpf").eq("id", params.id).single()

    if (!pessoaExistente) {
      return NextResponse.json({ error: "Pessoa não encontrada" }, { status: 404 })
    }

    // Verificar se o CPF já existe em outra pessoa
    if (body.cpf !== pessoaExistente.cpf) {
      const { data: cpfExistente } = await supabase
        .from("pessoas")
        .select("id")
        .eq("cpf", body.cpf)
        .neq("id", params.id)
        .maybeSingle()

      if (cpfExistente) {
        return NextResponse.json({ error: "CPF já cadastrado para outra pessoa" }, { status: 400 })
      }
    }

    const { data, error } = await supabase.from("pessoas").update(body).eq("id", params.id).select().single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao atualizar pessoa:", error)
    return NextResponse.json({ error: "Erro ao atualizar pessoa" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    // Verificar se a pessoa existe
    const { data: pessoaExistente } = await supabase.from("pessoas").select("id").eq("id", params.id).maybeSingle()

    if (!pessoaExistente) {
      return NextResponse.json({ error: "Pessoa não encontrada" }, { status: 404 })
    }

    const { error } = await supabase.from("pessoas").delete().eq("id", params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir pessoa:", error)
    return NextResponse.json({ error: "Erro ao excluir pessoa" }, { status: 500 })
  }
}
