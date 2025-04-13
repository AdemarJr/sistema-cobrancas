import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { clienteSchema } from "@/lib/validations"
import { validateRequest } from "@/lib/middleware"
import { handleApiError } from "@/lib/error-handling"

export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Verificar autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Buscar todos os clientes
    const { data, error } = await supabase.from("clientes").select("*").order("nome_completo", { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError.message, details: apiError.details }, { status: apiError.status })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Validar os dados da requisição
    const validation = await validateRequest(req, clienteSchema)
    if (!validation.success) {
      return validation.error
    }

    const clienteData = validation.data

    const supabase = createRouteHandlerClient({ cookies })

    // Verificar autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Inserir o novo cliente
    const { data, error } = await supabase
      .from("clientes")
      .insert([
        {
          ...clienteData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError.message, details: apiError.details }, { status: apiError.status })
  }
}
