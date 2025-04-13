import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("emprestimos")
      .select(`
        *,
        pessoa:pessoas(*),
        cobrancas:cobrancas(*)
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Empréstimo não encontrado" }, { status: 404 })
      }
      throw error
    }

    // Ordenar cobranças por data de vencimento
    if (data.cobrancas) {
      data.cobrancas.sort((a, b) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime())
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao buscar empréstimo:", error)
    return NextResponse.json({ error: "Erro ao buscar empréstimo" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = createServerSupabaseClient()

    // Verificar se o empréstimo existe
    const { data: emprestimoExistente } = await supabase
      .from("emprestimos")
      .select("id")
      .eq("id", params.id)
      .maybeSingle()

    if (!emprestimoExistente) {
      return NextResponse.json({ error: "Empréstimo não encontrado" }, { status: 404 })
    }

    const { data, error } = await supabase.from("emprestimos").update(body).eq("id", params.id).select().single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao atualizar empréstimo:", error)
    return NextResponse.json({ error: "Erro ao atualizar empréstimo" }, { status: 500 })
  }
}
