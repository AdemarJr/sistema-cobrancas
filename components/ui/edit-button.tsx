"use client"

import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { navegarComVerificacao } from "@/lib/route-validator"

interface EditButtonProps {
  tipo: "cliente" | "emprestimo" | "cobranca"
  id: string
  baseUrl: string
  fallbackUrl?: string
  className?: string
}

export function EditButton({ tipo, id, baseUrl, fallbackUrl = "/", className }: EditButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await navegarComVerificacao(router, tipo, id, baseUrl, fallbackUrl, toast)
    } catch (error) {
      console.error("Erro ao navegar:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar editar. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" size="icon" className={className} onClick={handleClick} disabled={isLoading}>
      <Pencil className="h-4 w-4" />
    </Button>
  )
}
