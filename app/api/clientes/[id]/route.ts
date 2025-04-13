import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { clienteSchema } from "@/lib/validations"
import { validateRequest } from "@/lib/middleware"
import { handleApiError } from "@/lib/error-handling"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Buscar cliente pelo ID
    const { data, error } = await supabase.from("clientes").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError.message, details: apiError.details }, { status: apiError.status })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

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

    // Verificar se o cliente existe
    const { data: existingCliente, error: checkError } = await supabase
      .from("clientes")
      .select("id")
      .eq("id", id)
      .single()

    if (checkError) {
      if (checkError.code === "PGRST116") {
        return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
      }
      throw checkError
    }

    // Atualizar o cliente
    const { data, error } = await supabase
      .from("clientes")
      .update({
        ...clienteData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError.message, details: apiError.details }, { status: apiError.status })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Verificar se existem empréstimos associados a este cliente
    const { data: emprestimos, error: checkError } = await supabase
      .from("emprestimos")
      .select("id")
      .eq("cliente_id", id)
      .limit(1)

    if (checkError) throw checkError

    if (emprestimos && emprestimos.length > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir este cliente pois existem empréstimos associados a ele" },
        { status: 400 },
      )
    }

    // Excluir o cliente
    const { error } = await supabase.from("clientes").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    const apiError = handleApiError(error)
    return NextResponse.json({ error: apiError.message, details: apiError.details }, { status: apiError.status })
  }
}
