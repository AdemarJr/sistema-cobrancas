import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { handleApiError } from "@/lib/error-handling"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const clienteId = searchParams.get("clienteId")
    const emprestimoId = searchParams.get("emprestimoId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const supabase = createRouteHandlerClient({ cookies })

    // Verificar autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Construir a consulta base
    let query = supabase
      .from("atividades")
      .select(`
        *,
        usuario:usuarios(email)
      `)
      .order("created_at", { ascending: false })

    // Aplicar filtros
    if (clienteId) {
      query = query.or(`entidade_id.eq.${clienteId},detalhes->cliente_id.eq.${clienteId}`)
    }

    if (emprestimoId) {
      query = query.or(`entidade_id.eq.${emprestimoId},detalhes->emprestimo_id.eq.${emprestimoId}`)
    }

    // Aplicar limite
    query = query.limit(limit)

    // Executar a consulta
    const { data, error } = await query

    if (error) throw error

    // Formatar os dados
    const formattedData = data?.map((item) => ({
      ...item,
      usuario_email: item.usuario?.email || "Sistema",
    }))

    return NextResponse.json(formattedData || [])
  } catch (error) {
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError.message, details: apiError.details }, { status: apiError.status })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = createRouteHandlerClient({ cookies })

    // Verificar autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Registrar atividade
    const { data, error } = await supabase
      .from("atividades")
      .insert({
        usuario_id: session.user.id,
        acao: body.acao,
        entidade: body.entidade,
        entidade_id: body.entidade_id,
        detalhes: body.detalhes || {},
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError.message, details: apiError.details }, { status: apiError.status })
  }
}
