import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  ArrowUpRight,
  BanknoteIcon,
  CalendarIcon,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        <Button variant="outline" size="sm" className="ml-auto gap-1">
          <ArrowUpRight className="h-4 w-4" />
          Exportar
        </Button>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">+5 no último mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Empréstimos Ativos</CardTitle>
                <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">+2 na última semana</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cobranças Pendentes</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">12 vencem hoje</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Recebido (Mês)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 24.560,00</div>
                <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Cobranças Recentes</CardTitle>
                <CardDescription>Últimas 5 cobranças registradas no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium leading-none">João Silva</p>
                        <p className="text-sm text-muted-foreground">Parcela 3/12</p>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm font-medium leading-none">R$ 450,00</p>
                      <p className="text-sm text-muted-foreground">Pago em 15/04/2025</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium leading-none">Maria Oliveira</p>
                        <p className="text-sm text-muted-foreground">Parcela 2/6</p>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm font-medium leading-none">R$ 750,00</p>
                      <p className="text-sm text-muted-foreground">Vence em 20/04/2025</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-sm font-medium leading-none">Carlos Pereira</p>
                        <p className="text-sm text-muted-foreground">Parcela 4/12</p>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm font-medium leading-none">R$ 320,00</p>
                      <p className="text-sm text-muted-foreground">Atrasado (5 dias)</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium leading-none">Ana Santos</p>
                        <p className="text-sm text-muted-foreground">Parcela 1/3</p>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm font-medium leading-none">R$ 1.200,00</p>
                      <p className="text-sm text-muted-foreground">Pago em 12/04/2025</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium leading-none">Roberto Almeida</p>
                        <p className="text-sm text-muted-foreground">Parcela 6/12</p>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm font-medium leading-none">R$ 550,00</p>
                      <p className="text-sm text-muted-foreground">Vence em 25/04/2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Status das Cobranças</CardTitle>
                <CardDescription>Distribuição das cobranças por status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                          <span className="text-sm">Pagas</span>
                        </div>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[65%] rounded-full bg-green-500" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-yellow-500" />
                          <span className="text-sm">A vencer</span>
                        </div>
                        <span className="text-sm font-medium">20%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[20%] rounded-full bg-yellow-500" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          <span className="text-sm">Atrasadas</span>
                        </div>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[15%] rounded-full bg-red-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Empréstimos por Mês</CardTitle>
                <CardDescription>Quantidade de novos empréstimos por mês</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Gráfico de barras seria exibido aqui</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pagamentos Recebidos</CardTitle>
                <CardDescription>Total de pagamentos recebidos por mês</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Gráfico de linha seria exibido aqui</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Inadimplência</CardTitle>
                <CardDescription>Percentual de cobranças em atraso</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Gráfico de área seria exibido aqui</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Disponíveis</CardTitle>
              <CardDescription>Acesse os relatórios do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4">
                  <div className="flex w-full items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">Pagamentos por Período</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    Relatório detalhado de pagamentos recebidos em um período específico
                  </p>
                </Button>
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4">
                  <div className="flex w-full items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">Cobranças Pendentes</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    Lista de cobranças pendentes e atrasadas por cliente
                  </p>
                </Button>
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4">
                  <div className="flex w-full items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">Empréstimos por Cliente</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    Relatório de empréstimos agrupados por cliente
                  </p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
