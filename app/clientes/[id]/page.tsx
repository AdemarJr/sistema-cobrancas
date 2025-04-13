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

export default function ClienteDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [cliente, setCliente] = useState(null)
  const [emprestimos, setEmprestimos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchCliente() {
      try {
        setIsLoading(true)
        const { data: cliente, error: clienteError } = await supabase
          .from("pessoas")
          .select("*")
          .eq("id", params.id)
          .single()

        if (clienteError) {
          throw clienteError
        }

        if (!cliente) {
          toast({
            title: "Cliente não encontrado",
            description: "O cliente solicitado não existe ou foi excluído.",
            variant: "destructive",
          })
          router.push("/clientes")
          return
        }

        setCliente(cliente)

        const { data: emprestimos, error: emprestimosError } = await supabase
          .from("emprestimos")
          .select("*")
          .eq("pessoa_id", params.id)
          .order("created_at", { ascending: false })

        if (emprestimosError) {
          throw emprestimosError
        }

        setEmprestimos(emprestimos || [])
      } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do cliente.",
          variant: "destructive",
        })
        router.push("/clientes")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCliente()
  }, [supabase, params.id, router, toast])

  const columns = [
    {
      header: "Valor",
      accessorKey: "valor",
      cell: (row) => formatarMoeda(Number(row.valor)),
    },
    {
      header: "Data de Início",
      accessorKey: "data_inicio",
      cell: (row) => formatarData(row.data_inicio),
    },
    {
      header: "Parcelas",
      accessorKey: "parcelas",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "QUITADO" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
          }`}
        >
          {row.status === "QUITADO" ? "Quitado" : "Em andamento"}
        </span>
      ),
    },
    {
      header: "Ações",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <SafeLink href={`/emprestimos/${row.id}`} tipo="emprestimo" id={row.id} fallbackUrl="/emprestimos">
              <Eye className="h-4 w-4" />
            </SafeLink>
          </Button>
          <EditButton tipo="emprestimo" id={row.id} baseUrl="/emprestimos/editar" fallbackUrl="/emprestimos" />
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/clientes">
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

  if (!cliente) return null

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/clientes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{cliente.nome}</h1>
        </div>
        <EditButton tipo="cliente" id={cliente.id} baseUrl="/clientes/editar" fallbackUrl="/clientes" />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Dados cadastrais do cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">CPF</h3>
                <p>{cliente.cpf}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">RG</h3>
                <p>{cliente.rg}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Telefone</h3>
                <p>{cliente.telefone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Indicado por</h3>
                <p>{cliente.indicado_por || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
            <CardDescription>Informações de localização</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
                <p>{cliente.endereco}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Cidade</h3>
                <p>{cliente.cidade}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
                <p>{cliente.estado}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">CEP</h3>
                <p>{cliente.cep}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Empréstimos</CardTitle>
              <CardDescription>Histórico de empréstimos do cliente</CardDescription>
            </div>
            <Button asChild>
              <Link href={`/emprestimos/cadastrar?cliente=${cliente.id}`}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Empréstimo
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <DataTableSafe
              data={emprestimos}
              columns={columns}
              pagination={emprestimos.length > 5}
              initialPageSize={5}
              linkConfig={{
                tipo: "emprestimo",
                getIdFn: (emprestimo) => emprestimo.id,
                baseUrl: "/emprestimos",
                fallbackUrl: "/emprestimos",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
