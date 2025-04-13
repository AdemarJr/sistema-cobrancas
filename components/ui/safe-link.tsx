"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { verificarEntidadeExiste } from "@/lib/route-validator"
import { type ReactNode, useState } from "react"

interface SafeLinkProps {
  href: string
  children: ReactNode
  tipo?: "cliente" | "emprestimo" | "cobranca"
  id?: string
  fallbackUrl?: string
  className?: string
  prefetch?: boolean
  skipCheck?: boolean // Nova propriedade para pular a verificação
}

export function SafeLink({
  href,
  children,
  tipo,
  id,
  fallbackUrl = "/",
  className,
  prefetch = false,
  skipCheck = false,
}: SafeLinkProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isChecking, setIsChecking] = useState(false)

  // Se não for um link para detalhes de entidade ou skipCheck for true, renderiza um Link normal
  if (!tipo || !id || skipCheck || href.includes("/cadastrar") || href.includes("/editar")) {
    return (
      <Link href={href} className={className} prefetch={prefetch}>
        {children}
      </Link>
    )
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (isChecking) return

    setIsChecking(true)

    try {
      const existe = await verificarEntidadeExiste(tipo, id)

      if (existe) {
        router.push(href)
      } else {
        toast({
          title: "Erro",
          description: `O ${tipo} solicitado não foi encontrado ou foi excluído`,
          variant: "destructive",
        })
        router.push(fallbackUrl)
      }
    } catch (error) {
      console.error("Erro ao verificar entidade:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao navegar. Tente novamente.",
        variant: "destructive",
      })
      router.push(fallbackUrl)
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
