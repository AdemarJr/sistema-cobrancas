"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { formatarData, formatarMoeda } from "@/lib/utils"
import type { Cobranca } from "@/types/database"
import { SafeLink } from "@/components/ui/safe-link"

interface CobrancaDetalhada extends Cobranca {
  emprestimo: {
    id: string
    pessoa: {
      nome: string
    }
  }
}

export default function CobrancasPage() {
  const [cobrancas, setCobrancas] = useState<CobrancaDetalhada[]>([])
  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("")
  const [dataVencimento, setDataVencimento] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const carregarCobrancas = async () => {
    try {
      setIsLoading(true)

      let url = "/api/cobrancas?"

      if (busca) {
        url += `busca=${encodeURIComponent(busca)}&`
      }

      if (status) {
        url += `status=${encodeURIComponent(status)}&`
      }

      if (dataVencimento) {
        url += `dataVencimento=${encodeURIComponent(dataVencimento)}&`
      }

      const res = await fetch(url)

      if (!res.ok) {
        throw new Error("Erro ao carregar cobranças")
      }

      const data = await res.json()
      setCobrancas(data)
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de cobranças.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    carregarCobrancas()

    // Verificar cobranças vencidas
    fetch("/api/verificar-vencimentos")
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw new Error("Erro ao verificar vencimentos")
      })
      .then((data) => {
        if (data.atualizadas > 0) {
          toast({
            title: "Cobranças atualizadas",
            description: `${data.atualizadas} cobranças foram marcadas como vencidas.`,
          })
          carregarCobrancas()
        }
      })
      .catch((error) => {
        console.error("Erro:", error)
      })
  }, [toast])

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault()
    carregarCobrancas()
  }

  const formatarStatus = (status: string) => {
    const statusMap = {
      PENDENTE: "Pendente",
      PAGO: "Pago",
      VENCIDO: "Vencido",
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const handlePagar = async (id: string) => {
    try {
      const res = await fetch(`/api/cobrancas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "PAGO",
          data_pagamento: new Date().toISOString().split("T")[0],
        }),
      })

      if (!res.ok) {
        throw new Error("Erro ao registrar pagamento")
      }

      toast({
        title: "Sucesso",
        description: "Pagamento registrado com sucesso.",
      })

      carregarCobrancas()
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: "Não foi possível registrar o pagamento.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Cobranças</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtrar Cobranças</CardTitle>
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
                  <SelectItem value="TODOS">Todos</SelectItem>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                  <SelectItem value="PAGO">Pago</SelectItem>
                  <SelectItem value="VENCIDO">Vencido</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                placeholder="Data de vencimento"
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
              />
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
                <TableHead>Empréstimo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pagamento</TableHead>
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
              ) : cobrancas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Nenhuma cobrança encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                cobrancas.map((cobranca) => (
                  <TableRow key={cobranca.id}>
                    <TableCell>
                      <SafeLink
                        href={`/emprestimos/${cobranca.emprestimo.id}`}
                        tipo="emprestimo"
                        id={cobranca.emprestimo.id}
                      >
                        Empréstimo #{cobranca.emprestimo.id.substring(0, 8)}
                      </SafeLink>
                    </TableCell>
                    <TableCell className="font-medium">{cobranca.emprestimo.pessoa.nome}</TableCell>
                    <TableCell>{formatarMoeda(Number(cobranca.valor))}</TableCell>
                    <TableCell>{formatarData(cobranca.data_vencimento)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          cobranca.status === "PAGO"
                            ? "outline"
                            : cobranca.status === "VENCIDO"
                              ? "destructive"
                              : "default"
                        }
                      >
                        {formatarStatus(cobranca.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{cobranca.data_pagamento ? formatarData(cobranca.data_pagamento) : "-"}</TableCell>
                    <TableCell className="text-right">
                      {cobranca.status !== "PAGO" && (
                        <Button variant="outline" size="icon" onClick={() => handlePagar(cobranca.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
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
