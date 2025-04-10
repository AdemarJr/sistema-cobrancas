"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Download, Edit, Search, Trash2, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"

type Usuario = {
  id: number
  nome: string
  email: string
  perfil: string
  status: boolean
  ultimo_acesso: string | null
  data_criacao: string
}

export default function UsuariosPage() {
  const router = useRouter()
  const [busca, setBusca] = useState("")
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const response = await fetch("/api/usuarios")

        if (!response.ok) {
          throw new Error("Falha ao carregar usuários")
        }

        const data = await response.json()
        setUsuarios(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro ao carregar os usuários")
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar a lista de usuários",
        })
      } finally {
        setIsLoading(false)
      }
    }

    carregarUsuarios()
  }, [])

  // Filtrar usuários com base na busca
  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busca.toLowerCase()) ||
      usuario.perfil.toLowerCase().includes(busca.toLowerCase()),
  )

  const handleExcluir = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        const response = await fetch(`/api/usuarios/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Falha ao excluir usuário")
        }

        // Atualizar a lista de usuários
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id))

        toast({
          title: "Sucesso",
          description: "Usuário excluído com sucesso",
        })
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível excluir o usuário",
        })
      }
    }
  }

  const formatarData = (dataString: string | null) => {
    if (!dataString) return "-"
    try {
      return format(new Date(dataString), "dd/MM/yyyy HH:mm", { locale: ptBR })
    } catch (error) {
      return dataString
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Usuários</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" className="h-8 gap-1" onClick={() => router.push("/dashboard/usuarios/novo")}>
            <UserPlus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div>
            <CardTitle>Gerenciar Usuários</CardTitle>
            <CardDescription>Gerencie todos os usuários cadastrados no sistema</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nome, email ou perfil..."
                className="pl-8"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Perfil</TableHead>
                  <TableHead className="hidden lg:table-cell">Último Acesso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : usuariosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Nenhum usuário encontrado com os critérios de busca.
                    </TableCell>
                  </TableRow>
                ) : (
                  usuariosFiltrados.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{usuario.perfil}</TableCell>
                      <TableCell className="hidden lg:table-cell">{formatarData(usuario.ultimo_acesso)}</TableCell>
                      <TableCell>
                        <Badge variant={usuario.status ? "default" : "secondary"}>
                          {usuario.status ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/dashboard/usuarios/editar/${usuario.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleExcluir(usuario.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
