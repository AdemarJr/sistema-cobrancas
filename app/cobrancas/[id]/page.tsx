"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EditButton } from "@/components/ui/edit-button"
import { SafeLink } from "@/components/ui/safe-link"
import { useToast } from "@/hooks/use-toast"
import { formatarData, formatarMoeda } from "@/lib/utils"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CobrancaDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [cobranca, setCobranca] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchCobranca() {
      try {
        setIsLoading(true)
        const { data: cobranca, error: cobrancaError } = await supabase
          .from("cobrancas")
          .select(
            `
            *,
            emprestimo:emprestimos(
              *,
              pessoa:pessoas(*)
            )
          `,
          )
          .eq("id", params.id)
          .single()

        if (cobrancaError) {
          throw cobrancaError
        }

        if (!cobranca) {
          toast({
            title: "Cobrança não encontrada",
            description: "A cobrança solicitada não existe ou foi excluída.",
            variant: "destructive",
          })
          router.push("/cobrancas")
          return
        }

        setCobranca(cobranca)
      } catch (error) {
        console.error("Erro ao buscar dados da cobrança:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da cobrança.",
          variant: "destructive",
        })
        router.push("/cobrancas")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCobranca()
  }, [supabase, params.id, router, toast])

  const getStatusClass = (status) => {
    switch (status) {
      case "PAGO":
        return "bg-green-100 text-green-800"
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-800"
      case "VENCIDO":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/cobrancas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Carregando...</h1>
        </div>
        <div className="grid gap-6">
          <Card className="animate-pulse">
            <CardHeader>
              <CardTitle className="h-8 bg-muted rounded"></CardTitle>
              <CardDescription className="h-4 bg-muted rounded w-1/3 mt-2"></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-muted rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!cobranca) return null

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/cobrancas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Cobrança #{params.id.slice(0, 8)}</h1>
        </div>
        <EditButton tipo="cobranca" id={cobranca.id} baseUrl="/cobrancas/editar" fallbackUrl="/cobrancas" />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Cobrança</CardTitle>
            <CardDescription>Detalhes da cobrança</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Cliente</h3>
                <p>
                  <SafeLink
                    href={`/clientes/${cobranca.emprestimo.pessoa.id}`}
                    tipo="cliente"
                    id={cobranca.emprestimo.pessoa.id}
                    fallbackUrl="/clientes"
                    className="hover:underline text-primary"
                  >
                    {cobranca.emprestimo.pessoa.nome}
                  </SafeLink>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Empréstimo</h3>
                <p>
                  <SafeLink
                    href={`/emprestimos/${cobranca.emprestimo.id}`}
                    tipo="emprestimo"
                    id={cobranca.emprestimo.id}
                    fallbackUrl="/emprestimos"
                    className="hover:underline text-primary"
                  >
                    #{cobranca.emprestimo.id.slice(0, 8)}
                  </SafeLink>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Valor</h3>
                <p>{formatarMoeda(Number(cobranca.valor))}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Data de Vencimento</h3>
                <p>{formatarData(cobranca.data_vencimento)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Data de Pagamento</h3>
                <p>{cobranca.data_pagamento ? formatarData(cobranca.data_pagamento) : "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(cobranca.status)}`}>
                    {cobranca.status === "PAGO" ? "Pago" : cobranca.status === "PENDENTE" ? "Pendente" : "Vencido"}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
