"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { Pessoa } from "@/types/database"

export default function CadastrarEmprestimoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    pessoaId: "",
    valor: "",
    dataInicio: "",
    tipoCobranca: "",
    parcelas: "",
  })

  useEffect(() => {
    const carregarPessoas = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/pessoas")

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

    carregarPessoas()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSaving(true)

      const res = await fetch("/api/emprestimos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Erro ao cadastrar empréstimo")
      }

      toast({
        title: "Sucesso",
        description: "Empréstimo cadastrado com sucesso.",
      })

      router.push("/emprestimos")
    } catch (error: any) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: error.message || "Não foi possível cadastrar o empréstimo.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/emprestimos">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Cadastrar Empréstimo</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Empréstimo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pessoa">Cliente</Label>
              <Select onValueChange={(value) => handleSelectChange("pessoaId", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {pessoas.map((pessoa) => (
                    <SelectItem key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valor">Valor do Empréstimo (R$)</Label>
                <Input
                  id="valor"
                  name="valor"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valor}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  name="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoCobranca">Tipo de Cobrança</Label>
                <Select onValueChange={(value) => handleSelectChange("tipoCobranca", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DIARIA">Diária</SelectItem>
                    <SelectItem value="SEMANAL">Semanal</SelectItem>
                    <SelectItem value="MENSAL">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parcelas">Número de Parcelas</Label>
                <Input
                  id="parcelas"
                  name="parcelas"
                  type="number"
                  min="1"
                  value={formData.parcelas}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/emprestimos")} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
