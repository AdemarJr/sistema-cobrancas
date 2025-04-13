"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { Pessoa } from "@/types/database"

export default function EditarPessoaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Pessoa>({
    id: "",
    nome: "",
    cpf: "",
    rg: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    indicado_por: "",
    created_at: "",
    updated_at: "",
  })

  useEffect(() => {
    const carregarPessoa = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/pessoas/${id}`)

        if (!res.ok) {
          throw new Error("Erro ao carregar dados da pessoa")
        }

        const data = await res.json()
        setFormData(data)
      } catch (error) {
        console.error("Erro:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da pessoa.",
          variant: "destructive",
        })
        router.push("/pessoas")
      } finally {
        setIsLoading(false)
      }
    }

    carregarPessoa()
  }, [id, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSaving(true)

      const res = await fetch(`/api/pessoas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Erro ao atualizar pessoa")
      }

      toast({
        title: "Sucesso",
        description: "Dados atualizados com sucesso.",
      })

      router.push("/pessoas")
    } catch (error: any) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar os dados.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center mb-6">
          <Link href="/pessoas">
            <Button variant="outline" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Carregando...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/pessoas">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Editar Pessoa</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input id="rg" name="rg" value={formData.rg || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input id="estado" name="estado" value={formData.estado} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" name="cep" value={formData.cep} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="indicado_por">Indicado por</Label>
              <Input
                id="indicado_por"
                name="indicado_por"
                value={formData.indicado_por || ""}
                onChange={handleChange}
                placeholder="Nome de quem indicou este cliente"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/pessoas")} disabled={isSaving}>
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
