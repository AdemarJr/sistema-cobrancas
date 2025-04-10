"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Clock, Download, Edit, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dados de exemplo para cobranças
const cobrancasExemplo = [
  {
    id: 1,
    cliente: "João Silva",
    emprestimo: "Empréstimo #1001",
    parcela: "3/12",
    valor: 458.33,
    vencimento: "12/05/2025",
    status: "Pendente",
    diasAtraso: 0,
  },
  {
    id: 2,
    cliente: "Maria Oliveira",
    emprestimo: "Empréstimo #1002",
    parcela: "1/6",
    valor: 458.33,
    vencimento: "05/05/2025",
    status: "Pendente",
    diasAtraso: 0,
  },
  {
    id: 3,
    cliente: "Carlos Pereira",
    emprestimo: "Empréstimo #1003",
    parcela: "2/12",
    valor: 916.67,
    vencimento: "20/04/2025",
    status: "Atrasado",
    diasAtraso: 5,
  },
  {
    id: 4,
    cliente: "Ana Santos",
    emprestimo: "Empréstimo #1004",
    parcela: "1/3",
    valor: 1050.0,
    vencimento: "10/05/2025",
    status: "Pendente",
    diasAtraso: 0,
  },
  {
    id: 5,
    cliente: "Roberto Almeida",
    emprestimo: "Empréstimo #1005",
    parcela: "2/12",
    valor: 687.5,
    vencimento: "25/04/2025",
    status: "Atrasado",
    diasAtraso: 3,
  },
]

export default function CobrancasPage() {
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")

  // Filtrar cobranças com base na busca e no filtro de status
  const cobrancasFiltradas = cobrancasExemplo.filter((cobranca) => {
    const matchBusca =
      cobranca.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      cobranca.emprestimo.toLowerCase().includes(busca.toLowerCase())

    const matchStatus = filtroStatus === "todos" || cobranca.status.toLowerCase() === filtroStatus.toLowerCase()

    return matchBusca && matchStatus
  })

  // Função para renderizar o ícone de status
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "Pago":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "Pendente":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Atrasado":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  // Função para renderizar a badge de status
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Pago":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Pago
          </Badge>
        )
      case "Pendente":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pendente
          </Badge>
        )
      case "Atrasado":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Atrasado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Cobranças</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div>
            <CardTitle>Gerenciar Cobranças</CardTitle>
            <CardDescription>Gerencie todas as cobranças do sistema</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por cliente ou empréstimo..."
                className="pl-8 w-full"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[180px]">
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="hidden md:table-cell">Empréstimo</TableHead>
                  <TableHead className="hidden md:table-cell">Parcela</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="hidden lg:table-cell">Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Dias em Atraso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cobrancasFiltradas.map((cobranca) => (
                  <TableRow key={cobranca.id}>
                    <TableCell className="font-medium">{cobranca.cliente}</TableCell>
                    <TableCell className="hidden md:table-cell">{cobranca.emprestimo}</TableCell>
                    <TableCell className="hidden md:table-cell">{cobranca.parcela}</TableCell>
                    <TableCell className="text-right">R$ {cobranca.valor.toFixed(2)}</TableCell>
                    <TableCell className="hidden lg:table-cell">{cobranca.vencimento}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {renderStatusIcon(cobranca.status)}
                        <span className="hidden md:inline-block">{renderStatusBadge(cobranca.status)}</span>
                        <span className="md:hidden">{cobranca.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {cobranca.diasAtraso > 0 ? cobranca.diasAtraso : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8">
                          Registrar Pagamento
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {cobrancasFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Nenhuma cobrança encontrada com os critérios de busca.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
