import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const emprestimoId = searchParams.get("emprestimoId")
    const status = searchParams.get("status")
    const dataInicio = searchParams.get("dataInicio")
    const dataFim = searchParams.get("dataFim")
    const busca = searchParams.get("busca")

    const supabase = createServerSupabaseClient()

    let query = supabase.from("cobrancas").select(`
        *,
        emprestimo:emprestimos(
          *,
          pessoa:pessoas(*)
        )
      `)

    if (emprestimoId) {
      query = query.eq("emprestimo_id", emprestimoId)
    }

    if (status && status !== "TODOS") {
      query = query.eq("status", status)
    }

    if (dataInicio) {
      query = query.gte("data_vencimento", dataInicio)
    }

    if (dataFim) {
      query = query.lte("data_vencimento", dataFim)
    }

    // Se houver busca, precisamos filtrar pelo nome ou CPF da pessoa
    if (busca) {
      // Primeiro, encontramos as pessoas que correspondem à busca
      const { data: pessoas } = await supabase
        .from("pessoas")
        .select("id")
        .or(`nome.ilike.%${busca}%,cpf.ilike.%${busca}%`)

      if (pessoas && pessoas.length > 0) {
        // Depois, encontramos os empréstimos dessas pessoas
        const pessoaIds = pessoas.map((p) => p.id)
        const { data: emprestimos } = await supabase.from("emprestimos").select("id").in("pessoa_id", pessoaIds)

        if (emprestimos && emprestimos.length > 0) {
          const emprestimoIds = emprestimos.map((e) => e.id)
          query = query.in("emprestimo_id", emprestimoIds)
        } else {
          // Se não encontrar nenhum empréstimo, retorna array vazio
          return NextResponse.json([])
        }
      } else {
        // Se não encontrar nenhuma pessoa, retorna array vazio
        return NextResponse.json([])
      }
    }

    const { data, error } = await query.order("data_vencimento", { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao buscar cobranças:", error)
    return NextResponse.json({ error: "Erro ao buscar cobranças" }, { status: 500 })
  }
}
