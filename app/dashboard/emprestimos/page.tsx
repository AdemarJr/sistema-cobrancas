"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BanknoteIcon, ChevronLeft, ChevronRight, Download, Edit, Eye, Search, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Dados de exemplo para empréstimos
const emprestimosExemplo = [
  {
    id: 1,
    cliente: "João Silva",
    valor: 5000.0,
    dataCriacao: "12/03/2025",
    parcelas: "3/12",
    valorParcela: 458.33,
    status: "Ativo",
    proximoVencimento: "12/05/2025",
  },
  {
    id: 2,
    cliente: "Maria Oliveira",
    valor: 2500.0,
    dataCriacao: "05/04/2025",
    parcelas: "1/6",
    valorParcela: 458.33,
    status: "Ativo",
    proximoVencimento: "05/05/2025",
  },
  {
    id: 3,
    cliente: "Carlos Pereira",
    valor: 10000.0,
    dataCriacao: "20/02/2025",
    parcelas: "3/12",
    valorParcela: 916.67,
    status: "Ativo",
    proximoVencimento: "20/05/2025",
  },
  {
    id: 4,
    cliente: "Ana Santos",
    valor: 3000.0,
    dataCriacao: "10/04/2025",
    parcelas: "1/3",
    valorParcela: 1050.0,
    status: "Ativo",
    proximoVencimento: "10/05/2025",
  },
  {
    id: 5,
    cliente: "Roberto Almeida",
    valor: 7500.0,
    dataCriacao: "25/03/2025",
    parcelas: "2/12",
    valorParcela: 687.5,
    status: "Ativo",
    proximoVencimento: "25/05/2025",
  },
]

export default function EmprestimosPage() {
  const [busca, setBusca] = useState("")

  // Filtrar empréstimos com base na busca
  const emprestimosFiltrados = emprestimosExemplo.filter(
    (emprestimo) =>
      emprestimo.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      emprestimo.status.toLowerCase().includes(busca.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Empréstimos</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <BanknoteIcon className="h-4 w-4" />
            Novo Empréstimo
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div>
            <CardTitle>Gerenciar Empréstimos</CardTitle>
            <CardDescription>Gerencie todos os empréstimos cadastrados no sistema</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por cliente ou status..."
                className="pl-8"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead className="hidden md:table-cell">Parcelas</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">Valor Parcela</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Próximo Vencimento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emprestimosFiltrados.map((emprestimo) => (
                  <TableRow key={emprestimo.id}>
                    <TableCell className="font-medium">{emprestimo.cliente}</TableCell>
                    <TableCell className="text-right">R$ {emprestimo.valor.toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell">{emprestimo.dataCriacao}</TableCell>
                    <TableCell className="hidden md:table-cell">{emprestimo.parcelas}</TableCell>
                    <TableCell className="hidden lg:table-cell text-right">
                      R$ {emprestimo.valorParcela.toFixed(2)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant={emprestimo.status === "Ativo" ? "default" : "secondary"}>
                        {emprestimo.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{emprestimo.proximoVencimento}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Visualizar</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {emprestimosFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Nenhum empréstimo encontrado com os critérios de busca.
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
