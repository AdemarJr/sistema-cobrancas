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
import { ArrowLeft, Save, Upload } from "lucide-react"

export default function NovoPagamentoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    cliente: "",
    emprestimo: "",
    parcela: "",
    valor: "",
    dataPagamento: "",
    formaPagamento: "",
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
    // Aqui seria implementada a lógica para salvar o pagamento
    console.log("Dados do pagamento:", formData)

    // Redirecionar para a lista de pagamentos após salvar
    router.push("/dashboard/pagamentos")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/dashboard/pagamentos")}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-lg font-semibold md:text-2xl ml-2">Registrar Pagamento</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Pagamento</CardTitle>
            <CardDescription>Preencha os dados para registrar um novo pagamento</CardDescription>
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
                <Label htmlFor="emprestimo">Empréstimo *</Label>
                <Select
                  value={formData.emprestimo}
                  onValueChange={(value) => handleSelectChange("emprestimo", value)}
                  required
                >
                  <SelectTrigger id="emprestimo">
                    <SelectValue placeholder="Selecione um empréstimo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Empréstimo #1001</SelectItem>
                    <SelectItem value="2">Empréstimo #1002</SelectItem>
                    <SelectItem value="3">Empréstimo #1003</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parcela">Parcela *</Label>
                <Select
                  value={formData.parcela}
                  onValueChange={(value) => handleSelectChange("parcela", value)}
                  required
                >
                  <SelectTrigger id="parcela">
                    <SelectValue placeholder="Selecione uma parcela" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Parcela 1 - R$ 458,33 (Vencimento: 12/05/2025)</SelectItem>
                    <SelectItem value="2">Parcela 2 - R$ 458,33 (Vencimento: 12/06/2025)</SelectItem>
                    <SelectItem value="3">Parcela 3 - R$ 458,33 (Vencimento: 12/07/2025)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor Pago (R$) *</Label>
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
                <Label htmlFor="dataPagamento">Data do Pagamento *</Label>
                <Input
                  id="dataPagamento"
                  name="dataPagamento"
                  type="date"
                  value={formData.dataPagamento}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                <Select
                  value={formData.formaPagamento}
                  onValueChange={(value) => handleSelectChange("formaPagamento", value)}
                  required
                >
                  <SelectTrigger id="formaPagamento">
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                    <SelectItem value="boleto">Boleto</SelectItem>
                    <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comprovante">Comprovante de Pagamento (opcional)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="comprovante"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF, PNG ou JPG (Máx. 2MB)</p>
                  </div>
                  <input id="comprovante" type="file" className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                placeholder="Informações adicionais sobre o pagamento"
                className="min-h-[100px]"
                value={formData.observacoes}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/dashboard/pagamentos")}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-1">
              <Save className="h-4 w-4" />
              Registrar Pagamento
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
