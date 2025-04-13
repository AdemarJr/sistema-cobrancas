import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { handleApiError } from "@/lib/error-handling"

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

    // Buscar notificações do usuário
    const { data, error } = await supabase
      .from("notificacoes")
      .select("*")
      .eq("usuario_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) throw error

    return NextResponse.json(data || [])
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

    // Criar nova notificação
    const { data, error } = await supabase
      .from("notificacoes")
      .insert({
        usuario_id: session.user.id,
        titulo: body.titulo,
        mensagem: body.mensagem,
        tipo: body.tipo || "INFO",
        link: body.link,
        lida: false,
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
