"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { clienteSchema } from "@/lib/validations"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { handleFetchResponse, showErrorToast } from "@/lib/error-handling"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type FormData = z.infer<typeof clienteSchema>

export default function CadastrarClientePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome_completo: "",
      tipo_documento: "CPF",
      documento: "",
      email: "",
      telefone_principal: "",
      telefone_secundario: "",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      observacoes: "",
      indicado_por: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)

      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      await handleFetchResponse(res)

      toast({
        title: "Sucesso",
        description: "Cliente cadastrado com sucesso.",
      })

      router.push("/clientes")
    } catch (error) {
      showErrorToast(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Função para buscar endereço pelo CEP
  const buscarCep = async (cep: string) => {
    if (cep.length !== 8) return

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (!data.erro) {
        setValue("logradouro", data.logradouro)
        setValue("bairro", data.bairro)
        setValue("cidade", data.localidade)
        setValue("estado", data.uf)
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/clientes">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Cadastrar Cliente</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome_completo">Nome Completo</Label>
                <Input id="nome_completo" {...register("nome_completo")} />
                {errors.nome_completo && <p className="text-sm text-red-500 mt-1">{errors.nome_completo.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_documento">Tipo de Documento</Label>
                <Select defaultValue="CPF" onValueChange={(value) => setValue("tipo_documento", value)}>
                  <SelectTrigger id="tipo_documento">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPF">CPF</SelectItem>
                    <SelectItem value="CNPJ">CNPJ</SelectItem>
                    <SelectItem value="RG">RG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documento">Documento</Label>
                <Input id="documento" {...register("documento")} />
                {errors.documento && <p className="text-sm text-red-500 mt-1">{errors.documento.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone_principal">Telefone Principal</Label>
                <Input id="telefone_principal" {...register("telefone_principal")} />
                {errors.telefone_principal && (
                  <p className="text-sm text-red-500 mt-1">{errors.telefone_principal.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone_secundario">Telefone Secundário (opcional)</Label>
                <Input id="telefone_secundario" {...register("telefone_secundario")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="indicado_por">Indicado por (opcional)</Label>
              <Input id="indicado_por" {...register("indicado_por")} placeholder="Nome de quem indicou este cliente" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" {...register("cep")} onBlur={(e) => buscarCep(e.target.value)} />
                {errors.cep && <p className="text-sm text-red-500 mt-1">{errors.cep.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="logradouro">Logradouro</Label>
                <Input id="logradouro" {...register("logradouro")} />
                {errors.logradouro && <p className="text-sm text-red-500 mt-1">{errors.logradouro.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input id="numero" {...register("numero")} />
                {errors.numero && <p className="text-sm text-red-500 mt-1">{errors.numero.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento (opcional)</Label>
                <Input id="complemento" {...register("complemento")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" {...register("bairro")} />
                {errors.bairro && <p className="text-sm text-red-500 mt-1">{errors.bairro.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" {...register("cidade")} />
                {errors.cidade && <p className="text-sm text-red-500 mt-1">{errors.cidade.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input id="estado" maxLength={2} {...register("estado")} />
                {errors.estado && <p className="text-sm text-red-500 mt-1">{errors.estado.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Textarea id="observacoes" {...register("observacoes")} />
            </div>

            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Por favor, corrija os erros acima para continuar.</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/clientes")} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
