import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { handleApiError } from "@/lib/error-handling"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createRouteHandlerClient({ cookies })

    // Verificar autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Marcar notificação como lida
    const { error } = await supabase
      .from("notificacoes")
      .update({ lida: true })
      .eq("id", id)
      .eq("usuario_id", session.user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError.message, details: apiError.details }, { status: apiError.status })
  }
}
