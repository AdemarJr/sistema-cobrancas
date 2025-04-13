"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { Pessoa } from "@/types/database"
import { SafeLink } from "@/components/ui/safe-link"

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [busca, setBusca] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const carregarPessoas = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/pessoas?busca=${encodeURIComponent(busca)}`)

      if (!res.ok) {
        throw new Error("Erro ao carregar pessoas")
      }

      const data = await res.json()
      setPessoas(data)
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de pessoas.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    carregarPessoas()
  }, [])

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault()
    carregarPessoas()
  }

  const handleExcluir = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta pessoa?")) {
      return
    }

    try {
      const res = await fetch(`/api/pessoas/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Erro ao excluir pessoa")
      }

      toast({
        title: "Sucesso",
        description: "Pessoa excluída com sucesso.",
      })

      carregarPessoas()
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a pessoa.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pessoas</h1>
        <Link href="/pessoas/cadastrar">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Pessoa
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtrar Pessoas</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Buscar por nome ou CPF" value={busca} onChange={(e) => setBusca(e.target.value)} />
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
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : pessoas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Nenhuma pessoa encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                pessoas.map((pessoa) => (
                  <TableRow key={pessoa.id}>
                    <TableCell className="font-medium">{pessoa.nome}</TableCell>
                    <TableCell>{pessoa.cpf}</TableCell>
                    <TableCell>{pessoa.telefone}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <SafeLink href={`/pessoas/${pessoa.id}`} tipo="cliente" id={pessoa.id}>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </SafeLink>
                        <Button variant="outline" size="icon" onClick={() => handleExcluir(pessoa.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
