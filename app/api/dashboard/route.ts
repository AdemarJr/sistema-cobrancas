import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Verificar autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Obter estatísticas
    const [
      { data: totalClientes },
      { data: totalEmprestimos },
      { data: totalCobrancas },
      { data: valorPendente },
      { data: proximasCobrancas },
      { data: cobrancasVencidas },
      { data: emprestimosRecentes },
    ] = await Promise.all([
      // Total de clientes
      supabase
        .from("pessoas")
        .select("id", { count: "exact", head: true }),

      // Total de empréstimos ativos
      supabase
        .from("emprestimos")
        .select("id", { count: "exact", head: true })
        .eq("status", "EM_ANDAMENTO"),

      // Total de cobranças pendentes
      supabase
        .from("cobrancas")
        .select("id", { count: "exact", head: true })
        .in("status", ["PENDENTE", "VENCIDO"]),

      // Valor total pendente
      supabase.rpc("calcular_valor_total_pendente"),

      // Próximas cobranças (próximos 7 dias)
      supabase
        .from("cobrancas")
        .select(`
          id,
          valor,
          data_vencimento,
          status,
          emprestimo_id,
          emprestimo:emprestimos(
            id,
            pessoa:pessoas(
              id,
              nome
            )
          )
        `)
        .eq("status", "PENDENTE")
        .gte("data_vencimento", new Date().toISOString().split("T")[0])
        .lte("data_vencimento", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
        .order("data_vencimento", { ascending: true })
        .limit(5),

      // Cobranças vencidas
      supabase
        .from("cobrancas")
        .select(`
          id,
          valor,
          data_vencimento,
          status,
          emprestimo_id,
          emprestimo:emprestimos(
            id,
            pessoa:pessoas(
              id,
              nome
            )
          )
        `)
        .eq("status", "VENCIDO")
        .order("data_vencimento", { ascending: true })
        .limit(5),

      // Empréstimos recentes
      supabase
        .from("emprestimos")
        .select(`
          id,
          valor,
          data_inicio,
          status,
          parcelas,
          pessoa:pessoas(
            id,
            nome
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5),
    ])

    return NextResponse.json({
      estatisticas: {
        totalClientes: totalClientes?.count || 0,
        totalEmprestimos: totalEmprestimos?.count || 0,
        totalCobrancas: totalCobrancas?.count || 0,
        valorPendente: valorPendente?.[0]?.valor || 0,
      },
      proximasCobrancas: proximasCobrancas || [],
      cobrancasVencidas: cobrancasVencidas || [],
      emprestimosRecentes: emprestimosRecentes || [],
    })
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return NextResponse.json({ error: "Erro ao buscar dados do dashboard" }, { status: 500 })
  }
}
