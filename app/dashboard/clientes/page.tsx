"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Download, Edit, Eye, Search, Trash2, UserPlus } from "lucide-react"

// Dados de exemplo para clientes
const clientesExemplo = [
  {
    id: 1,
    nome: "João Silva",
    cpf: "123.456.789-00",
    telefone: "(11) 98765-4321",
    email: "joao.silva@exemplo.com",
    emprestimosAtivos: 2,
    ultimoEmprestimo: "12/03/2025",
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    cpf: "987.654.321-00",
    telefone: "(11) 91234-5678",
    email: "maria.oliveira@exemplo.com",
    emprestimosAtivos: 1,
    ultimoEmprestimo: "05/04/2025",
  },
  {
    id: 3,
    nome: "Carlos Pereira",
    cpf: "456.789.123-00",
    telefone: "(11) 95555-9999",
    email: "carlos.pereira@exemplo.com",
    emprestimosAtivos: 3,
    ultimoEmprestimo: "20/02/2025",
  },
  {
    id: 4,
    nome: "Ana Santos",
    cpf: "789.123.456-00",
    telefone: "(11) 94444-8888",
    email: "ana.santos@exemplo.com",
    emprestimosAtivos: 1,
    ultimoEmprestimo: "10/04/2025",
  },
  {
    id: 5,
    nome: "Roberto Almeida",
    cpf: "321.654.987-00",
    telefone: "(11) 93333-7777",
    email: "roberto.almeida@exemplo.com",
    emprestimosAtivos: 2,
    ultimoEmprestimo: "25/03/2025",
  },
]

export default function ClientesPage() {
  const [busca, setBusca] = useState("")

  // Filtrar clientes com base na busca
  const clientesFiltrados = clientesExemplo.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.cpf.includes(busca) ||
      cliente.email.toLowerCase().includes(busca.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Clientes</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <UserPlus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div>
            <CardTitle>Gerenciar Clientes</CardTitle>
            <CardDescription>Gerencie todos os clientes cadastrados no sistema</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nome, CPF ou email..."
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
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead className="hidden md:table-cell">Telefone</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Empréstimos Ativos</TableHead>
                  <TableHead className="hidden lg:table-cell">Último Empréstimo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientesFiltrados.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>{cliente.cpf}</TableCell>
                    <TableCell className="hidden md:table-cell">{cliente.telefone}</TableCell>
                    <TableCell className="hidden md:table-cell">{cliente.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{cliente.emprestimosAtivos}</TableCell>
                    <TableCell className="hidden lg:table-cell">{cliente.ultimoEmprestimo}</TableCell>
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
                {clientesFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Nenhum cliente encontrado com os critérios de busca.
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
