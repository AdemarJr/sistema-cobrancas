import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { gerarCobrancas } from "@/lib/utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pessoaId = searchParams.get("pessoaId")
    const status = searchParams.get("status")
    const tipoCobranca = searchParams.get("tipoCobranca")
    const busca = searchParams.get("busca")

    const supabase = createServerSupabaseClient()

    let query = supabase.from("emprestimos").select(`
        *,
        pessoa:pessoas(*),
        cobrancas:cobrancas(*)
      `)

    if (pessoaId) {
      query = query.eq("pessoa_id", pessoaId)
    }

    if (status && status !== "ALL") {
      query = query.eq("status", status)
    }

    if (tipoCobranca && tipoCobranca !== "ALL") {
      query = query.eq("tipo_cobranca", tipoCobranca)
    }

    // Se houver busca, precisamos filtrar pelo nome ou CPF da pessoa
    if (busca) {
      // Primeiro, encontramos as pessoas que correspondem à busca
      const { data: pessoas } = await supabase
        .from("pessoas")
        .select("id")
        .or(`nome.ilike.%${busca}%,cpf.ilike.%${busca}%`)

      if (pessoas && pessoas.length > 0) {
        const pessoaIds = pessoas.map((p) => p.id)
        query = query.in("pessoa_id", pessoaIds)
      } else {
        // Se não encontrar nenhuma pessoa, retorna array vazio
        return NextResponse.json([])
      }
    }

    const { data, error } = await query.order("data_inicio", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao buscar empréstimos:", error)
    return NextResponse.json({ error: "Erro ao buscar empréstimos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pessoaId, valor, dataInicio, tipoCobranca, parcelas } = body

    const supabase = createServerSupabaseClient()

    // Verificar se a pessoa existe
    const { data: pessoa, error: pessoaError } = await supabase
      .from("pessoas")
      .select("id")
      .eq("id", pessoaId)
      .maybeSingle()

    if (pessoaError || !pessoa) {
      return NextResponse.json({ error: "Pessoa não encontrada" }, { status: 404 })
    }

    // Criar o empréstimo
    const { data: emprestimo, error: emprestimoError } = await supabase
      .from("emprestimos")
      .insert({
        valor: Number(valor),
        data_inicio: dataInicio,
        tipo_cobranca: tipoCobranca,
        parcelas: Number(parcelas),
        pessoa_id: pessoaId,
        status: "EM_ANDAMENTO",
      })
      .select()
      .single()

    if (emprestimoError || !emprestimo) {
      throw emprestimoError || new Error("Erro ao criar empréstimo")
    }

    // Gerar as cobranças
    const cobrancasData = gerarCobrancas(dataInicio, Number(valor), Number(parcelas), tipoCobranca)

    // Adicionar o ID do empréstimo a cada cobrança
    const cobrancasComEmprestimoId = cobrancasData.map((cobranca) => ({
      ...cobranca,
      emprestimo_id: emprestimo.id,
      status: "PENDENTE",
    }))

    // Criar as cobranças
    const { error: cobrancasError } = await supabase.from("cobrancas").insert(cobrancasComEmprestimoId)

    if (cobrancasError) {
      // Se houver erro ao criar as cobranças, excluir o empréstimo
      await supabase.from("emprestimos").delete().eq("id", emprestimo.id)
      throw cobrancasError
    }

    return NextResponse.json(emprestimo, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar empréstimo:", error)
    return NextResponse.json({ error: "Erro ao criar empréstimo" }, { status: 500 })
  }
}
