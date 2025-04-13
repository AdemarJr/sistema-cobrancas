"use client"

import { CobrancaCard } from "@/components/dashboard/cobranca-card"
import { EmprestimoCard } from "@/components/dashboard/emprestimo-card"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SafeLink } from "@/components/ui/safe-link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatarMoeda } from "@/lib/formatters"
import { Users, CreditCard, Calendar, DollarSign, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

interface DashboardData {
  estatisticas: {
    totalClientes: number
    totalEmprestimos: number
    totalCobrancas: number
    valorPendente: number
  }
  proximasCobrancas: any[]
  cobrancasVencidas: any[]
  emprestimosRecentes: any[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/dashboard")

        if (!response.ok) {
          throw new Error("Falha ao carregar dados do dashboard")
        }

        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err)
        setError("Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-[120px] animate-pulse bg-muted" />
          ))}
        </div>
        <Card className="mt-6 animate-pulse bg-muted h-[400px]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {data && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatsCard
              title="Total de Clientes"
              value={data.estatisticas.totalClientes}
              icon={<Users className="h-4 w-4" />}
            />
            <StatsCard
              title="Empréstimos Ativos"
              value={data.estatisticas.totalEmprestimos}
              icon={<CreditCard className="h-4 w-4" />}
            />
            <StatsCard
              title="Cobranças Pendentes"
              value={data.estatisticas.totalCobrancas}
              icon={<Calendar className="h-4 w-4" />}
            />
            <StatsCard
              title="Valor Pendente"
              value={formatarMoeda(Number(data.estatisticas.valorPendente))}
              icon={<DollarSign className="h-4 w-4" />}
            />
          </div>

          <Tabs defaultValue="proximas" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="proximas">Próximas Cobranças</TabsTrigger>
              <TabsTrigger value="vencidas">Cobranças Vencidas</TabsTrigger>
              <TabsTrigger value="emprestimos">Empréstimos Recentes</TabsTrigger>
            </TabsList>

            <TabsContent value="proximas">
              <Card>
                <CardHeader>
                  <CardTitle>Próximas Cobranças</CardTitle>
                  <CardDescription>Cobranças com vencimento nos próximos 7 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.proximasCobrancas.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      Não há cobranças próximas para os próximos 7 dias.
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {data.proximasCobrancas.map((cobranca) => (
                        <SafeLink
                          key={cobranca.id}
                          href={`/cobrancas/${cobranca.id}`}
                          tipo="cobranca"
                          id={cobranca.id}
                          fallbackUrl="/cobrancas"
                        >
                          <CobrancaCard cobranca={cobranca} tipo="proxima" />
                        </SafeLink>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vencidas">
              <Card>
                <CardHeader>
                  <CardTitle>Cobranças Vencidas</CardTitle>
                  <CardDescription>Cobranças que já passaram da data de vencimento</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.cobrancasVencidas.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">Não há cobranças vencidas no momento.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {data.cobrancasVencidas.map((cobranca) => (
                        <SafeLink
                          key={cobranca.id}
                          href={`/cobrancas/${cobranca.id}`}
                          tipo="cobranca"
                          id={cobranca.id}
                          fallbackUrl="/cobrancas"
                        >
                          <CobrancaCard cobranca={cobranca} tipo="vencida" />
                        </SafeLink>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emprestimos">
              <Card>
                <CardHeader>
                  <CardTitle>Empréstimos Recentes</CardTitle>
                  <CardDescription>Últimos empréstimos cadastrados no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.emprestimosRecentes.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">Não há empréstimos recentes.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {data.emprestimosRecentes.map((emprestimo) => (
                        <SafeLink
                          key={emprestimo.id}
                          href={`/emprestimos/${emprestimo.id}`}
                          tipo="emprestimo"
                          id={emprestimo.id}
                          fallbackUrl="/emprestimos"
                        >
                          <EmprestimoCard emprestimo={emprestimo} />
                        </SafeLink>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
