"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTableSafe } from "@/components/ui/data-table-safe"
import { EditButton } from "@/components/ui/edit-button"
import { SafeLink } from "@/components/ui/safe-link"
import { useToast } from "@/hooks/use-toast"
import { formatarData, formatarMoeda } from "@/lib/utils"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ArrowLeft, Eye, Plus } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EmprestimoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [emprestimo, setEmprestimo] = useState(null)
  const [cobrancas, setCobrancas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchEmprestimo() {
      try {
        setIsLoading(true)
        const { data: emprestimo, error: emprestimoError } = await supabase
          .from("emprestimos")
          .select(
            `
            *,
            pessoa:pessoas(*)
          `,
          )
          .eq("id", params.id)
          .single()

        if (emprestimoError) {
          throw emprestimoError
        }

        if (!emprestimo) {
          toast({
            title: "Empréstimo não encontrado",
            description: "O empréstimo solicitado não existe ou foi excluído.",
            variant: "destructive",
          })
          router.push("/emprestimos")
          return
        }

        setEmprestimo(emprestimo)

        const { data: cobrancas, error: cobrancasError } = await supabase
          .from("cobrancas")
          .select("*")
          .eq("emprestimo_id", params.id)
          .order("data_vencimento", { ascending: true })

        if (cobrancasError) {
          throw cobrancasError
        }

        setCobrancas(cobrancas || [])
      } catch (error) {
        console.error("Erro ao buscar dados do empréstimo:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do empréstimo.",
          variant: "destructive",
        })
        router.push("/emprestimos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmprestimo()
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

  const columns = [
    {
      header: "Valor",
      accessorKey: "valor",
      cell: (row) => formatarMoeda(Number(row.valor)),
    },
    {
      header: "Vencimento",
      accessorKey: "data_vencimento",
      cell: (row) => formatarData(row.data_vencimento),
    },
    {
      header: "Pagamento",
      accessorKey: "data_pagamento",
      cell: (row) => (row.data_pagamento ? formatarData(row.data_pagamento) : "-"),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(row.status)}`}>
          {row.status === "PAGO" ? "Pago" : row.status === "PENDENTE" ? "Pendente" : "Vencido"}
        </span>
      ),
    },
    {
      header: "Ações",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <SafeLink href={`/cobrancas/${row.id}`} tipo="cobranca" id={row.id} fallbackUrl="/cobrancas">
              <Eye className="h-4 w-4" />
            </SafeLink>
          </Button>
          <EditButton tipo="cobranca" id={row.id} baseUrl="/cobrancas/editar" fallbackUrl="/cobrancas" />
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/emprestimos">
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

  if (!emprestimo) return null

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/emprestimos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Empréstimo #{params.id.slice(0, 8)}</h1>
        </div>
        <EditButton tipo="emprestimo" id={emprestimo.id} baseUrl="/emprestimos/editar" fallbackUrl="/emprestimos" />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Empréstimo</CardTitle>
            <CardDescription>Detalhes do empréstimo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Cliente</h3>
                <p>
                  <SafeLink
                    href={`/clientes/${emprestimo.pessoa.id}`}
                    tipo="cliente"
                    id={emprestimo.pessoa.id}
                    fallbackUrl="/clientes"
                    className="hover:underline text-primary"
                  >
                    {emprestimo.pessoa.nome}
                  </SafeLink>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Valor</h3>
                <p>{formatarMoeda(Number(emprestimo.valor))}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Data de Início</h3>
                <p>{formatarData(emprestimo.data_inicio)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Tipo de Cobrança</h3>
                <p>
                  {emprestimo.tipo_cobranca === "MENSAL"
                    ? "Mensal"
                    : emprestimo.tipo_cobranca === "SEMANAL"
                      ? "Semanal"
                      : "Diária"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Parcelas</h3>
                <p>{emprestimo.parcelas}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      emprestimo.status === "QUITADO" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {emprestimo.status === "QUITADO" ? "Quitado" : "Em andamento"}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Cobranças</CardTitle>
              <CardDescription>Parcelas do empréstimo</CardDescription>
            </div>
            <Button asChild>
              <Link href={`/cobrancas/cadastrar?emprestimo=${emprestimo.id}`}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Cobrança
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <DataTableSafe
              data={cobrancas}
              columns={columns}
              pagination={cobrancas.length > 5}
              initialPageSize={5}
              linkConfig={{
                tipo: "cobranca",
                getIdFn: (cobranca) => cobranca.id,
                baseUrl: "/cobrancas",
                fallbackUrl: "/cobrancas",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
