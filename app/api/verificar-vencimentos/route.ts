import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const hoje = new Date().toISOString().split("T")[0]

    // Buscar todas as cobranças pendentes com data de vencimento anterior a hoje
    const { data: cobrancasVencidas, error } = await supabase
      .from("cobrancas")
      .select("id")
      .eq("status", "PENDENTE")
      .lt("data_vencimento", hoje)

    if (error) {
      throw error
    }

    // Atualizar o status das cobranças para VENCIDO
    if (cobrancasVencidas && cobrancasVencidas.length > 0) {
      const ids = cobrancasVencidas.map((c) => c.id)

      const { error: updateError } = await supabase.from("cobrancas").update({ status: "VENCIDO" }).in("id", ids)

      if (updateError) {
        throw updateError
      }
    }

    return NextResponse.json({
      success: true,
      atualizadas: cobrancasVencidas ? cobrancasVencidas.length : 0,
    })
  } catch (error) {
    console.error("Erro ao verificar vencimentos:", error)
    return NextResponse.json({ error: "Erro ao verificar vencimentos" }, { status: 500 })
  }
}
