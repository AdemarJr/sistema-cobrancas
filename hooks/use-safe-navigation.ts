"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { navegarComVerificacao } from "@/lib/route-validator"

export function useSafeNavigation() {
  const router = useRouter()
  const { toast } = useToast()

  const navigateTo = async (
    tipo: "cliente" | "emprestimo" | "cobranca",
    id: string,
    baseUrl: string,
    fallbackUrl = "/",
  ) => {
    try {
      await navegarComVerificacao(router, tipo, id, baseUrl, fallbackUrl, toast)
    } catch (error) {
      console.error("Erro ao navegar:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao navegar. Tente novamente.",
        variant: "destructive",
      })
      router.push(fallbackUrl)
    }
  }

  return { navigateTo }
}
