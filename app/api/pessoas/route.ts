import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const busca = searchParams.get("busca") || ""

    const supabase = createServerSupabaseClient()

    let query = supabase.from("pessoas").select("*")

    if (busca) {
      query = query.or(`nome.ilike.%${busca}%,cpf.ilike.%${busca}%`)
    }

    const { data, error } = await query.order("nome")

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao buscar pessoas:", error)
    return NextResponse.json({ error: "Erro ao buscar pessoas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = createServerSupabaseClient()

    // Verificar se CPF já existe
    const { data: pessoaExistente } = await supabase.from("pessoas").select("id").eq("cpf", body.cpf).maybeSingle()

    if (pessoaExistente) {
      return NextResponse.json({ error: "CPF já cadastrado" }, { status: 400 })
    }

    const { data, error } = await supabase.from("pessoas").insert(body).select().single()

    if (error) {
      throw error
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar pessoa:", error)
    return NextResponse.json({ error: "Erro ao criar pessoa" }, { status: 500 })
  }
}
