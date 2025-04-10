"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function EditarUsuarioPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    perfil: "",
    status: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [alterarSenha, setAlterarSenha] = useState(false)

  const [erros, setErros] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    perfil: "",
  })

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const response = await fetch(`/api/usuarios/${params.id}`)

        if (!response.ok) {
          throw new Error("Falha ao carregar dados do usuário")
        }

        const usuario = await response.json()

        setFormData({
          nome: usuario.nome,
          email: usuario.email,
          senha: "",
          confirmarSenha: "",
          perfil: usuario.perfil,
          status: usuario.status,
        })
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os dados do usuário",
        })
        router.push("/dashboard/usuarios")
      } finally {
        setIsLoading(false)
      }
    }

    carregarUsuario()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpar erro do campo quando o usuário digitar
    if (erros[name as keyof typeof erros]) {
      setErros((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpar erro do campo quando o usuário selecionar
    if (erros[name as keyof typeof erros]) {
      setErros((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked }))
  }

  const validarFormulario = () => {
    let formValido = true
    const novosErros = { ...erros }

    // Validar nome
    if (!formData.nome.trim()) {
      novosErros.nome = "Nome é obrigatório"
      formValido = false
    }

    // Validar email
    if (!formData.email.trim()) {
      novosErros.email = "Email é obrigatório"
      formValido = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      novosErros.email = "Email inválido"
      formValido = false
    }

    // Validar senha apenas se o usuário escolheu alterar
    if (alterarSenha) {
      if (!formData.senha) {
        novosErros.senha = "Senha é obrigatória"
        formValido = false
      } else if (formData.senha.length < 6) {
        novosErros.senha = "A senha deve ter pelo menos 6 caracteres"
        formValido = false
      }

      // Validar confirmação de senha
      if (formData.senha !== formData.confirmarSenha) {
        novosErros.confirmarSenha = "As senhas não coincidem"
        formValido = false
      }
    }

    // Validar perfil
    if (!formData.perfil) {
      novosErros.perfil = "Perfil é obrigatório"
      formValido = false
    }

    setErros(novosErros)
    return formValido
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validarFormulario()) {
      setIsSaving(true)

      try {
        // Preparar dados para envio
        const dadosUsuario: any = {
          nome: formData.nome,
          email: formData.email,
          perfil: formData.perfil,
          status: formData.status,
        }

        // Incluir senha apenas se o usuário escolheu alterar
        if (alterarSenha && formData.senha) {
          dadosUsuario.senha = formData.senha
        }

        // Enviar para a API
        const response = await fetch(`/api/usuarios/${params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosUsuario),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Falha ao atualizar usuário")
        }

        toast({
          title: "Sucesso",
          description: "Usuário atualizado com sucesso",
        })

        // Redirecionar para a lista de usuários
        router.push("/dashboard/usuarios")
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: err instanceof Error ? err.message : "Ocorreu um erro ao atualizar o usuário",
        })
      } finally {
        setIsSaving(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/dashboard/usuarios")}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-lg font-semibold md:text-2xl ml-2">Editar Usuário</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-10">
            <p>Carregando dados do usuário...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/dashboard/usuarios")}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-lg font-semibold md:text-2xl ml-2">Editar Usuário</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Usuário</CardTitle>
            <CardDescription>Edite os dados do usuário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Nome completo do usuário"
                  value={formData.nome}
                  onChange={handleChange}
                />
                {erros.nome && <p className="text-sm text-red-500">{erros.nome}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="usuario@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {erros.email && <p className="text-sm text-red-500">{erros.email}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Switch id="alterarSenha" checked={alterarSenha} onCheckedChange={setAlterarSenha} />
                  <Label htmlFor="alterarSenha" className="cursor-pointer">
                    Alterar senha
                  </Label>
                </div>
              </div>
              {alterarSenha && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="senha">Nova Senha *</Label>
                    <Input
                      id="senha"
                      name="senha"
                      type="password"
                      placeholder="Digite a nova senha"
                      value={formData.senha}
                      onChange={handleChange}
                    />
                    {erros.senha && <p className="text-sm text-red-500">{erros.senha}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar Nova Senha *</Label>
                    <Input
                      id="confirmarSenha"
                      name="confirmarSenha"
                      type="password"
                      placeholder="Confirme a nova senha"
                      value={formData.confirmarSenha}
                      onChange={handleChange}
                    />
                    {erros.confirmarSenha && <p className="text-sm text-red-500">{erros.confirmarSenha}</p>}
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="perfil">Perfil de Acesso *</Label>
                <Select value={formData.perfil} onValueChange={(value) => handleSelectChange("perfil", value)}>
                  <SelectTrigger id="perfil">
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="gerente">Gerente</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="operador">Operador</SelectItem>
                    <SelectItem value="atendente">Atendente</SelectItem>
                  </SelectContent>
                </Select>
                {erros.perfil && <p className="text-sm text-red-500">{erros.perfil}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="status" checked={formData.status} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="status" className="cursor-pointer">
                    {formData.status ? "Ativo" : "Inativo"}
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/dashboard/usuarios")}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-1" disabled={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
