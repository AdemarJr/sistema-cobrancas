import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("cobrancas")
      .select(`
        *,
        emprestimo:emprestimos(
          *,
          pessoa:pessoas(*)
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Cobrança não encontrada" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao buscar cobrança:", error)
    return NextResponse.json({ error: "Erro ao buscar cobrança" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = createServerSupabaseClient()

    // Verificar se a cobrança existe
    const { data: cobrancaExistente } = await supabase
      .from("cobrancas")
      .select("id, emprestimo_id")
      .eq("id", params.id)
      .single()

    if (!cobrancaExistente) {
      return NextResponse.json({ error: "Cobrança não encontrada" }, { status: 404 })
    }

    // Atualizar a cobrança
    const { data, error } = await supabase.from("cobrancas").update(body).eq("id", params.id).select().single()

    if (error) {
      throw error
    }

    // Se a cobrança foi marcada como paga, verificar se todas as cobranças do empréstimo foram pagas
    if (body.status === "PAGO") {
      // Buscar todas as cobranças do empréstimo
      const { data: todasCobrancas } = await supabase
        .from("cobrancas")
        .select("status")
        .eq("emprestimo_id", cobrancaExistente.emprestimo_id)

      if (todasCobrancas) {
        const todasPagas = todasCobrancas.every((c) => c.status === "PAGO")

        if (todasPagas) {
          // Atualizar o status do empréstimo para QUITADO
          await supabase.from("emprestimos").update({ status: "QUITADO" }).eq("id", cobrancaExistente.emprestimo_id)
        }
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao atualizar cobrança:", error)
    return NextResponse.json({ error: "Erro ao atualizar cobrança" }, { status: 500 })
  }
}
