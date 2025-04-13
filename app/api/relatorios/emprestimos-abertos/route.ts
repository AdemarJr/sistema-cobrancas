import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const busca = searchParams.get("busca") || ""

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

    // Buscar empréstimos em aberto
    let query = supabase
      .from("emprestimos")
      .select(`
        *,
        pessoa:pessoas(*),
        cobrancas:cobrancas(*)
      `)
      .eq("status", "EM_ANDAMENTO")

    if (busca && pessoaIds.length > 0) {
      query = query.in("pessoa_id", pessoaIds)
    }

    const { data, error } = await query.order("data_inicio", { ascending: false })

    if (error) {
      throw error
    }

    // Calcular informações adicionais para cada empréstimo
    const relatorio = data.map((emprestimo) => {
      const parcelasPagas = emprestimo.cobrancas.filter((c) => c.status === "PAGO").length

      const valorPago = emprestimo.cobrancas
        .filter((c) => c.status === "PAGO")
        .reduce((total, c) => total + Number.parseFloat(c.valor), 0)

      const valorRestante = Number.parseFloat(emprestimo.valor) - valorPago

      return {
        ...emprestimo,
        parcelas_pagas: parcelasPagas,
        valor_pago: valorPago,
        valor_restante: valorRestante,
      }
    })

    return NextResponse.json(relatorio)
  } catch (error) {
    console.error("Erro ao gerar relatório de empréstimos em aberto:", error)
    return NextResponse.json({ error: "Erro ao gerar relatório" }, { status: 500 })
  }
}
