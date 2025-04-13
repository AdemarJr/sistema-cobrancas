import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    // Buscar a pessoa
    const { data: pessoa, error: pessoaError } = await supabase.from("pessoas").select("*").eq("id", params.id).single()

    if (pessoaError) {
      if (pessoaError.code === "PGRST116") {
        return NextResponse.json({ error: "Pessoa não encontrada" }, { status: 404 })
      }
      throw pessoaError
    }

    // Buscar os empréstimos da pessoa
    const { data: emprestimos, error: emprestimosError } = await supabase
      .from("emprestimos")
      .select(`
        *,
        cobrancas:cobrancas(*)
      `)
      .eq("pessoa_id", params.id)
      .order("data_inicio", { ascending: false })

    if (emprestimosError) {
      throw emprestimosError
    }

    // Calcular informações adicionais para cada empréstimo
    const emprestimosDetalhados = emprestimos.map((emprestimo) => {
      const parcelasPagas = emprestimo.cobrancas.filter((c) => c.status === "PAGO").length

      const valorPago = emprestimo.cobrancas
        .filter((c) => c.status === "PAGO")
        .reduce((total, c) => total + Number.parseFloat(c.valor), 0)

      const valorRestante = Number.parseFloat(emprestimo.valor) - valorPago

      // Ordenar cobranças por data de vencimento
      emprestimo.cobrancas.sort((a, b) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime())

      return {
        ...emprestimo,
        parcelas_pagas: parcelasPagas,
        valor_pago: valorPago,
        valor_restante: valorRestante,
      }
    })

    // Calcular estatísticas gerais
    const totalEmprestimos = emprestimos.length
    const emprestimosEmAndamento = emprestimos.filter((e) => e.status === "EM_ANDAMENTO").length
    const emprestimosQuitados = emprestimos.filter((e) => e.status === "QUITADO").length

    const valorTotalEmprestado = emprestimos.reduce((total, e) => total + Number.parseFloat(e.valor), 0)

    const valorTotalPago = emprestimos.reduce((total, e) => {
      const valorPago = e.cobrancas
        .filter((c) => c.status === "PAGO")
        .reduce((subtotal, c) => subtotal + Number.parseFloat(c.valor), 0)

      return total + valorPago
    }, 0)

    const valorTotalPendente = valorTotalEmprestado - valorTotalPago

    const relatorio = {
      pessoa,
      emprestimos: emprestimosDetalhados,
      estatisticas: {
        total_emprestimos: totalEmprestimos,
        emprestimos_em_andamento: emprestimosEmAndamento,
        emprestimos_quitados: emprestimosQuitados,
        valor_total_emprestado: valorTotalEmprestado,
        valor_total_pago: valorTotalPago,
        valor_total_pendente: valorTotalPendente,
      },
    }

    return NextResponse.json(relatorio)
  } catch (error) {
    console.error("Erro ao gerar relatório por pessoa:", error)
    return NextResponse.json({ error: "Erro ao gerar relatório" }, { status: 500 })
  }
}
