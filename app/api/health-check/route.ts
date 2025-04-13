import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Tenta executar uma consulta simples para verificar se está funcionando
    const { data, error } = await supabase.from("pessoas").select("id").limit(1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      status: "ok",
      message: "Banco de dados conectado com sucesso",
      database: "Supabase",
    })
  } catch (error) {
    console.error("Erro de conexão com o banco de dados:", error)

    return NextResponse.json(
      {
        status: "error",
        error: "Não foi possível conectar ao banco de dados. Verifique suas configurações.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
