import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const busca = searchParams.get("busca") || ""
    const status = searchParams.get("status")

    const supabase = createServerSupabaseClient()

    // Primeiro, encontramos as pessoas que correspondem à busca
    let pessoaIds: string[] = []

    if (busca) {
      const { data: pessoas } = await supabase
        .from("pessoas")
        .select("id")
        .or(`nome.ilike.%${busca}%,cpf.ilike.%${busca}%`)

      if (pessoas && pessoas.length > 0) {
        pessoaIds = pessoas.map((p) => p.id)
      } else {
        // Se não encontrar nenhuma pessoa, retorna array vazio
        return NextResponse.json([])
      }
    }

    // Depois, encontramos os empréstimos dessas pessoas
    let emprestimoIds: string[] = []

    if (busca && pessoaIds.length > 0) {
      const { data: emprestimos } = await supabase.from("emprestimos").select("id").in("pessoa_id", pessoaIds)

      if (emprestimos && emprestimos.length > 0) {
        emprestimoIds = emprestimos.map((e) => e.id)
      } else {
        // Se não encontrar nenhum empréstimo, retorna array vazio
        return NextResponse.json([])
      }
    }

    // Buscar cobranças pendentes ou vencidas
    let query = supabase.from("cobrancas").select(`
        *,
        emprestimo:emprestimos(
          *,
          pessoa:pessoas(*)
        )
      `)

    if (status && status !== "TODOS") {
      query = query.eq("status", status)
    } else {
      query = query.in("status", ["PENDENTE", "VENCIDO"])
    }

    if (busca && emprestimoIds.length > 0) {
      query = query.in("emprestimo_id", emprestimoIds)
    }

    const { data, error } = await query.order("data_vencimento", { ascending: true })

    if (error) {
      throw error
    }

    // Calcular dias vencidos para cobranças vencidas
    const hoje = new Date()
    const relatorio = data.map((cobranca) => {
      let diasVencidos = null

      if (cobranca.status === "VENCIDO") {
        const dataVencimento = new Date(cobranca.data_vencimento)
        const diffTime = Math.abs(hoje.getTime() - dataVencimento.getTime())
        diasVencidos = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      }

      return {
        ...cobranca,
        dias_vencidos: diasVencidos,
      }
    })

    return NextResponse.json(relatorio)
  } catch (error) {
    console.error("Erro ao gerar relatório de cobranças pendentes:", error)
    return NextResponse.json({ error: "Erro ao gerar relatório" }, { status: 500 })
  }
}
