"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Calendar, Download, FileText, LineChart, PieChart, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RelatoriosPage() {
  const [dataInicial, setDataInicial] = useState("")
  const [dataFinal, setDataFinal] = useState("")
  const [cliente, setCliente] = useState("")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Relatórios</h1>
      </div>

      <Tabs defaultValue="pagamentos" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="pagamentos" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Pagamentos</span>
          </TabsTrigger>
          <TabsTrigger value="pendencias" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Pendências</span>
          </TabsTrigger>
          <TabsTrigger value="clientes" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Clientes</span>
          </TabsTrigger>
          <TabsTrigger value="graficos" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Gráficos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pagamentos">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Pagamentos</CardTitle>
              <CardDescription>Visualize todos os pagamentos recebidos em um período específico</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataInicial">Data Inicial</Label>
                  <Input
                    id="dataInicial"
                    type="date"
                    value={dataInicial}
                    onChange={(e) => setDataInicial(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataFinal">Data Final</Label>
                  <Input id="dataFinal" type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente (opcional)</Label>
                  <Select value={cliente} onValueChange={setCliente}>
                    <SelectTrigger id="cliente">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os clientes</SelectItem>
                      <SelectItem value="1">João Silva</SelectItem>
                      <SelectItem value="2">Maria Oliveira</SelectItem>
                      <SelectItem value="3">Carlos Pereira</SelectItem>
                      <SelectItem value="4">Ana Santos</SelectItem>
                      <SelectItem value="5">Roberto Almeida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Exportar CSV
                </Button>
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Exportar PDF
                </Button>
                <Button className="gap-1">
                  <FileText className="h-4 w-4" />
                  Gerar Relatório
                </Button>
              </div>

              <div className="rounded-md border p-8 flex items-center justify-center">
                <p className="text-muted-foreground">
                  Selecione os filtros acima e clique em "Gerar Relatório" para visualizar os dados.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendencias">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Pendências</CardTitle>
              <CardDescription>Visualize todas as cobranças pendentes e atrasadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vencimentoInicial">Vencimento Inicial</Label>
                  <Input id="vencimentoInicial" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vencimentoFinal">Vencimento Final</Label>
                  <Input id="vencimentoFinal" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientePendencia">Cliente (opcional)</Label>
                  <Select>
                    <SelectTrigger id="clientePendencia">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os clientes</SelectItem>
                      <SelectItem value="1">João Silva</SelectItem>
                      <SelectItem value="2">Maria Oliveira</SelectItem>
                      <SelectItem value="3">Carlos Pereira</SelectItem>
                      <SelectItem value="4">Ana Santos</SelectItem>
                      <SelectItem value="5">Roberto Almeida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Exportar CSV
                </Button>
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Exportar PDF
                </Button>
                <Button className="gap-1">
                  <FileText className="h-4 w-4" />
                  Gerar Relatório
                </Button>
              </div>

              <div className="rounded-md border p-8 flex items-center justify-center">
                <p className="text-muted-foreground">
                  Selecione os filtros acima e clique em "Gerar Relatório" para visualizar os dados.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Clientes</CardTitle>
              <CardDescription>Visualize informações detalhadas sobre seus clientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="statusEmprestimo">Status do Empréstimo</Label>
                  <Select>
                    <SelectTrigger id="statusEmprestimo">
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clienteRelatorio">Cliente (opcional)</Label>
                  <Select>
                    <SelectTrigger id="clienteRelatorio">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os clientes</SelectItem>
                      <SelectItem value="1">João Silva</SelectItem>
                      <SelectItem value="2">Maria Oliveira</SelectItem>
                      <SelectItem value="3">Carlos Pereira</SelectItem>
                      <SelectItem value="4">Ana Santos</SelectItem>
                      <SelectItem value="5">Roberto Almeida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Exportar CSV
                </Button>
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Exportar PDF
                </Button>
                <Button className="gap-1">
                  <FileText className="h-4 w-4" />
                  Gerar Relatório
                </Button>
              </div>

              <div className="rounded-md border p-8 flex items-center justify-center">
                <p className="text-muted-foreground">
                  Selecione os filtros acima e clique em "Gerar Relatório" para visualizar os dados.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graficos">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Empréstimos por Mês</CardTitle>
                <CardDescription>Quantidade de novos empréstimos por mês</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <BarChart3 className="h-16 w-16 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Gráfico de barras seria exibido aqui</p>
                  <Button variant="outline" size="sm" className="mt-2 gap-1">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pagamentos Recebidos</CardTitle>
                <CardDescription>Total de pagamentos recebidos por mês</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <LineChart className="h-16 w-16 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Gráfico de linha seria exibido aqui</p>
                  <Button variant="outline" size="sm" className="mt-2 gap-1">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Status</CardTitle>
                <CardDescription>Distribuição de cobranças por status</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <PieChart className="h-16 w-16 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Gráfico de pizza seria exibido aqui</p>
                  <Button variant="outline" size="sm" className="mt-2 gap-1">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taxa de Inadimplência</CardTitle>
                <CardDescription>Percentual de cobranças em atraso por mês</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <LineChart className="h-16 w-16 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Gráfico de área seria exibido aqui</p>
                  <Button variant="outline" size="sm" className="mt-2 gap-1">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
