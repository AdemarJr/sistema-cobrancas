"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, ChevronLeft, ChevronRight, Download, FileText, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dados de exemplo para pagamentos
const pagamentosExemplo = [
  {
    id: 1,
    cliente: "João Silva",
    emprestimo: "Empréstimo #1001",
    parcela: "2/12",
    valor: 458.33,
    dataPagamento: "12/04/2025",
    formaPagamento: "Dinheiro",
    comprovante: true,
  },
  {
    id: 2,
    cliente: "Maria Oliveira",
    emprestimo: "Empréstimo #1002",
    parcela: "1/6",
    valor: 458.33,
    dataPagamento: "05/04/2025",
    formaPagamento: "Transferência",
    comprovante: true,
  },
  {
    id: 3,
    cliente: "Carlos Pereira",
    emprestimo: "Empréstimo #1003",
    parcela: "1/12",
    valor: 916.67,
    dataPagamento: "20/03/2025",
    formaPagamento: "Boleto",
    comprovante: false,
  },
  {
    id: 4,
    cliente: "Ana Santos",
    emprestimo: "Empréstimo #1004",
    parcela: "1/3",
    valor: 1050.0,
    dataPagamento: "10/04/2025",
    formaPagamento: "Cartão de Crédito",
    comprovante: true,
  },
  {
    id: 5,
    cliente: "Roberto Almeida",
    emprestimo: "Empréstimo #1005",
    parcela: "1/12",
    valor: 687.5,
    dataPagamento: "25/03/2025",
    formaPagamento: "Dinheiro",
    comprovante: false,
  },
]

export default function PagamentosPage() {
  const [busca, setBusca] = useState("")
  const [filtroFormaPagamento, setFiltroFormaPagamento] = useState("todos")

  // Filtrar pagamentos com base na busca e no filtro de forma de pagamento
  const pagamentosFiltrados = pagamentosExemplo.filter((pagamento) => {
    const matchBusca =
      pagamento.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      pagamento.emprestimo.toLowerCase().includes(busca.toLowerCase())

    const matchFormaPagamento =
      filtroFormaPagamento === "todos" || pagamento.formaPagamento.toLowerCase() === filtroFormaPagamento.toLowerCase()

    return matchBusca && matchFormaPagamento
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Pagamentos</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <Calendar className="h-4 w-4" />
            Registrar Pagamento
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div>
            <CardTitle>Histórico de Pagamentos</CardTitle>
            <CardDescription>Visualize todos os pagamentos registrados no sistema</CardDescription>
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
            <div className="w-full md:w-[220px]">
              <Select value={filtroFormaPagamento} onValueChange={setFiltroFormaPagamento}>
                <SelectTrigger>
                  <SelectValue placeholder="Forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as formas</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="transferência">Transferência</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="cartão de crédito">Cartão de Crédito</SelectItem>
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
                  <TableHead className="hidden lg:table-cell">Data</TableHead>
                  <TableHead>Forma de Pagamento</TableHead>
                  <TableHead className="text-right">Comprovante</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagamentosFiltrados.map((pagamento) => (
                  <TableRow key={pagamento.id}>
                    <TableCell className="font-medium">{pagamento.cliente}</TableCell>
                    <TableCell className="hidden md:table-cell">{pagamento.emprestimo}</TableCell>
                    <TableCell className="hidden md:table-cell">{pagamento.parcela}</TableCell>
                    <TableCell className="text-right">R$ {pagamento.valor.toFixed(2)}</TableCell>
                    <TableCell className="hidden lg:table-cell">{pagamento.dataPagamento}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{pagamento.formaPagamento}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {pagamento.comprovante ? (
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <FileText className="h-4 w-4" />
                          Visualizar
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">Não disponível</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {pagamentosFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Nenhum pagamento encontrado com os critérios de busca.
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
