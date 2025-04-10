import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/supabase/db-init"

export async function GET() {
  try {
    const result = await initializeDatabase()

    if (result.success) {
      return NextResponse.json({ message: "Banco de dados inicializado com sucesso" })
    } else {
      return NextResponse.json(
        { error: "Falha ao inicializar o banco de dados", details: result.error },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Erro ao processar a requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
