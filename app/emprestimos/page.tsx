"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Search, Eye } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { formatarData, formatarMoeda } from "@/lib/utils"
import type { Emprestimo } from "@/types/database"
import { SafeLink } from "@/components/ui/safe-link"

export default function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("")
  const [tipoCobranca, setTipoCobranca] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const carregarEmprestimos = async () => {
    try {
      setIsLoading(true)

      let url = "/api/emprestimos?"

      if (busca) {
        url += `busca=${encodeURIComponent(busca)}&`
      }

      if (status) {
        url += `status=${encodeURIComponent(status)}&`
      }

      if (tipoCobranca) {
        url += `tipoCobranca=${encodeURIComponent(tipoCobranca)}&`
      }

      const res = await fetch(url)

      if (!res.ok) {
        throw new Error("Erro ao carregar empréstimos")
      }

      const data = await res.json()
      setEmprestimos(data)
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de empréstimos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    carregarEmprestimos()
  }, [])

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault()
    carregarEmprestimos()
  }

  const formatarTipoCobranca = (tipo: string) => {
    const tipos = {
      DIARIA: "Diária",
      SEMANAL: "Semanal",
      MENSAL: "Mensal",
    }
    return tipos[tipo as keyof typeof tipos] || tipo
  }

  const formatarStatus = (status: string) => {
    const statusMap = {
      EM_ANDAMENTO: "Em andamento",
      QUITADO: "Quitado",
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Empréstimos</h1>
        <Link href="/emprestimos/cadastrar">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Empréstimo
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtrar Empréstimos</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBuscar}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input placeholder="Nome ou CPF do cliente" value={busca} onChange={(e) => setBusca(e.target.value)} />
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="EM_ANDAMENTO">Em andamento</SelectItem>
                  <SelectItem value="QUITADO">Quitado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tipoCobranca} onValueChange={setTipoCobranca}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Cobrança" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="DIARIA">Diária</SelectItem>
                  <SelectItem value="SEMANAL">Semanal</SelectItem>
                  <SelectItem value="MENSAL">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" variant="secondary">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Parcelas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : emprestimos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Nenhum empréstimo encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                emprestimos.map((emprestimo) => (
                  <TableRow key={emprestimo.id}>
                    <TableCell className="font-medium">{emprestimo.pessoa?.nome}</TableCell>
                    <TableCell>{formatarMoeda(Number(emprestimo.valor))}</TableCell>
                    <TableCell>{formatarData(emprestimo.data_inicio)}</TableCell>
                    <TableCell>{formatarTipoCobranca(emprestimo.tipo_cobranca)}</TableCell>
                    <TableCell>{emprestimo.parcelas}</TableCell>
                    <TableCell>
                      <Badge variant={emprestimo.status === "QUITADO" ? "outline" : "default"}>
                        {formatarStatus(emprestimo.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <SafeLink href={`/emprestimos/${emprestimo.id}`} tipo="emprestimo" id={emprestimo.id}>
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </SafeLink>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
