"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function NovoEmprestimoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    cliente: "",
    valor: "",
    dataConcessao: "",
    taxaJuros: "",
    numeroParcelas: "",
    periodicidade: "mensal",
    diaSemana: "",
    diaMes: "",
    primeiroVencimento: "",
    status: "ativo",
    observacoes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui seria implementada a lógica para salvar o empréstimo
    console.log("Dados do empréstimo:", formData)

    // Redirecionar para a lista de empréstimos após salvar
    router.push("/dashboard/emprestimos")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/dashboard/emprestimos")}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-lg font-semibold md:text-2xl ml-2">Novo Empréstimo</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Empréstimo</CardTitle>
            <CardDescription>Preencha os dados para cadastrar um novo empréstimo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Select
                  value={formData.cliente}
                  onValueChange={(value) => handleSelectChange("cliente", value)}
                  required
                >
                  <SelectTrigger id="cliente">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">João Silva</SelectItem>
                    <SelectItem value="2">Maria Oliveira</SelectItem>
                    <SelectItem value="3">Carlos Pereira</SelectItem>
                    <SelectItem value="4">Ana Santos</SelectItem>
                    <SelectItem value="5">Roberto Almeida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor do Empréstimo (R$) *</Label>
                <Input
                  id="valor"
                  name="valor"
                  placeholder="0,00"
                  value={formData.valor}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataConcessao">Data de Concessão *</Label>
                <Input
                  id="dataConcessao"
                  name="dataConcessao"
                  type="date"
                  value={formData.dataConcessao}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxaJuros">Taxa de Juros (% a.m.)</Label>
                <Input
                  id="taxaJuros"
                  name="taxaJuros"
                  placeholder="0,00"
                  value={formData.taxaJuros}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroParcelas">Número de Parcelas *</Label>
                <Input
                  id="numeroParcelas"
                  name="numeroParcelas"
                  type="number"
                  min="1"
                  placeholder="12"
                  value={formData.numeroParcelas}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primeiroVencimento">Data do Primeiro Vencimento *</Label>
                <Input
                  id="primeiroVencimento"
                  name="primeiroVencimento"
                  type="date"
                  value={formData.primeiroVencimento}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Periodicidade das Cobranças *</Label>
              <RadioGroup
                value={formData.periodicidade}
                onValueChange={(value) => handleSelectChange("periodicidade", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="diaria" id="diaria" />
                  <Label htmlFor="diaria">Diária</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="semanal" id="semanal" />
                  <Label htmlFor="semanal">Semanal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mensal" id="mensal" />
                  <Label htmlFor="mensal">Mensal</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.periodicidade === "semanal" && (
              <div className="space-y-2">
                <Label htmlFor="diaSemana">Dia da Semana *</Label>
                <Select
                  value={formData.diaSemana}
                  onValueChange={(value) => handleSelectChange("diaSemana", value)}
                  required
                >
                  <SelectTrigger id="diaSemana">
                    <SelectValue placeholder="Selecione o dia da semana" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Segunda-feira</SelectItem>
                    <SelectItem value="2">Terça-feira</SelectItem>
                    <SelectItem value="3">Quarta-feira</SelectItem>
                    <SelectItem value="4">Quinta-feira</SelectItem>
                    <SelectItem value="5">Sexta-feira</SelectItem>
                    <SelectItem value="6">Sábado</SelectItem>
                    <SelectItem value="0">Domingo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.periodicidade === "mensal" && (
              <div className="space-y-2">
                <Label htmlFor="diaMes">Dia do Mês *</Label>
                <Select value={formData.diaMes} onValueChange={(value) => handleSelectChange("diaMes", value)} required>
                  <SelectTrigger id="diaMes">
                    <SelectValue placeholder="Selecione o dia do mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="status">Status do Empréstimo</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                placeholder="Informações adicionais sobre o empréstimo"
                className="min-h-[100px]"
                value={formData.observacoes}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/dashboard/emprestimos")}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-1">
              <Save className="h-4 w-4" />
              Salvar Empréstimo
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
