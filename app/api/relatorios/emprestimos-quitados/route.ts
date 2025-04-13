import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const busca = searchParams.get("busca") || ""
    const dataInicio = searchParams.get("dataInicio")
    const dataFim = searchParams.get("dataFim")

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

    // Buscar empréstimos quitados
    let query = supabase
      .from("emprestimos")
      .select(`
        *,
        pessoa:pessoas(*),
        cobrancas:cobrancas(*)
      `)
      .eq("status", "QUITADO")

    if (busca && pessoaIds.length > 0) {
      query = query.in("pessoa_id", pessoaIds)
    }

    if (dataInicio) {
      query = query.gte("data_inicio", dataInicio)
    }

    if (dataFim) {
      query = query.lte("data_inicio", dataFim)
    }

    const { data, error } = await query.order("data_inicio", { ascending: false })

    if (error) {
      throw error
    }

    // Calcular a data de quitação (data do último pagamento)
    const relatorio = data.map((emprestimo) => {
      const cobrancasPagas = emprestimo.cobrancas.filter((c) => c.status === "PAGO")

      let dataQuitacao = null
      if (cobrancasPagas.length > 0) {
        // Encontrar a cobrança com a data de pagamento mais recente
        const ultimoPagamento = cobrancasPagas.reduce((latest, current) => {
          if (!latest.data_pagamento) return current
          if (!current.data_pagamento) return latest

          return new Date(current.data_pagamento) > new Date(latest.data_pagamento) ? current : latest
        })

        dataQuitacao = ultimoPagamento.data_pagamento
      }

      return {
        ...emprestimo,
        data_quitacao: dataQuitacao,
      }
    })

    return NextResponse.json(relatorio)
  } catch (error) {
    console.error("Erro ao gerar relatório de empréstimos quitados:", error)
    return NextResponse.json({ error: "Erro ao gerar relatório" }, { status: 500 })
  }
}
