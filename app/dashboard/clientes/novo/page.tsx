"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"

export default function NovoClientePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: "",
    cpfCnpj: "",
    telefone: "",
    email: "",
    dataNascimento: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    informacoesAdicionais: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui seria implementada a lógica para salvar o cliente
    console.log("Dados do cliente:", formData)

    // Redirecionar para a lista de clientes após salvar
    router.push("/dashboard/clientes")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/dashboard/clientes")}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-lg font-semibold md:text-2xl ml-2">Novo Cliente</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Preencha os dados pessoais do cliente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    placeholder="Nome completo do cliente"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                  <Input
                    id="cpfCnpj"
                    name="cpfCnpj"
                    placeholder="000.000.000-00"
                    value={formData.cpfCnpj}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="cliente@exemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento/Fundação</Label>
                  <Input
                    id="dataNascimento"
                    name="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>Preencha os dados de endereço do cliente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" name="cep" placeholder="00000-000" value={formData.cep} onChange={handleChange} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input
                    id="logradouro"
                    name="logradouro"
                    placeholder="Rua, Avenida, etc."
                    value={formData.logradouro}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input id="numero" name="numero" placeholder="Nº" value={formData.numero} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    name="complemento"
                    placeholder="Apto, Bloco, etc."
                    value={formData.complemento}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    name="bairro"
                    placeholder="Bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    name="cidade"
                    placeholder="Cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    name="estado"
                    placeholder="Estado"
                    value={formData.estado}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
              <CardDescription>Informações complementares sobre o cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="informacoesAdicionais">Observações</Label>
                <Textarea
                  id="informacoesAdicionais"
                  name="informacoesAdicionais"
                  placeholder="Informações adicionais sobre o cliente"
                  className="min-h-[100px]"
                  value={formData.informacoesAdicionais}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push("/dashboard/clientes")}>
                Cancelar
              </Button>
              <Button type="submit" className="gap-1">
                <Save className="h-4 w-4" />
                Salvar Cliente
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
