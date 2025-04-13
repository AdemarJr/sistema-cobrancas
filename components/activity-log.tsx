"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatarData } from "@/lib/utils"
import { handleFetchResponse, showErrorToast } from "@/lib/error-handling"
import { useToast } from "@/hooks/use-toast"
import { LoadingState } from "@/components/loading-state"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ActivityLogProps {
  clienteId?: string
  emprestimoId?: string
  limit?: number
  showAll?: boolean
}

interface Activity {
  id: string
  usuario_id: string
  usuario_email: string
  acao: string
  entidade: string
  entidade_id: string
  detalhes: any
  created_at: string
}

export function ActivityLog({ clienteId, emprestimoId, limit = 5, showAll = false }: ActivityLogProps) {
  const { toast } = useToast()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expanded, setExpanded] = useState(showAll)

  useEffect(() => {
    carregarAtividades()
  }, [clienteId, emprestimoId])

  const carregarAtividades = async () => {
    try {
      setIsLoading(true)
      let url = "/api/atividades?"

      if (clienteId) {
        url += `clienteId=${clienteId}&`
      }

      if (emprestimoId) {
        url += `emprestimoId=${emprestimoId}&`
      }

      url += `limit=${expanded ? 100 : limit}`

      const res = await fetch(url)
      const data = await handleFetchResponse(res)
      setActivities(data)
    } catch (error) {
      showErrorToast(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (entidade: string, acao: string) => {
    const icons: Record<string, Record<string, string>> = {
      cliente: {
        criar: "👤",
        atualizar: "✏️",
        excluir: "🗑️",
      },
      emprestimo: {
        criar: "💰",
        atualizar: "✏️",
        quitar: "✅",
      },
      cobranca: {
        criar: "📅",
        pagar: "💸",
        vencer: "⏰",
      },
      usuario: {
        login: "🔑",
        logout: "🚪",
        atualizar: "✏️",
      },
    }

    return icons[entidade]?.[acao] || "📝"
  }

  const formatActivityMessage = (activity: Activity) => {
    const { acao, entidade, detalhes } = activity

    switch (`${entidade}:${acao}`) {
      case "cliente:criar":
        return `Cliente "${detalhes.nome_completo}" foi cadastrado`
      case "cliente:atualizar":
        return `Cliente "${detalhes.nome_completo}" foi atualizado`
      case "cliente:excluir":
        return `Cliente "${detalhes.nome_completo}" foi excluído`
      case "emprestimo:criar":
        return `Empréstimo de ${detalhes.valor} foi criado para ${detalhes.cliente_nome}`
      case "emprestimo:atualizar":
        return `Empréstimo #${detalhes.id.substring(0, 8)} foi atualizado`
      case "emprestimo:quitar":
        return `Empréstimo #${detalhes.id.substring(0, 8)} foi quitado`
      case "cobranca:criar":
        return `Cobrança de ${detalhes.valor} foi criada para o empréstimo #${detalhes.emprestimo_id.substring(0, 8)}`
      case "cobranca:pagar":
        return `Cobrança #${detalhes.id.substring(0, 8)} foi paga`
      case "cobranca:vencer":
        return `Cobrança #${detalhes.id.substring(0, 8)} venceu`
      case "usuario:login":
        return `Usuário realizou login`
      case "usuario:logout":
        return `Usuário realizou logout`
      default:
        return `${acao} ${entidade}`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Atividades</CardTitle>
        <CardDescription>
          {clienteId
            ? "Registro de atividades relacionadas a este cliente"
            : emprestimoId
              ? "Registro de atividades relacionadas a este empréstimo"
              : "Últimas atividades do sistema"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 flex justify-center">
            <LoadingState />
          </div>
        ) : activities.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">Nenhuma atividade encontrada.</div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="text-2xl">{getActivityIcon(activity.entidade, activity.acao)}</div>
                <div className="flex-1">
                  <p className="text-sm">{formatActivityMessage(activity)}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">{formatarData(activity.created_at)}</span>
                    <span className="text-xs text-muted-foreground">por {activity.usuario_email}</span>
                  </div>
                </div>
              </div>
            ))}

            {!showAll && activities.length >= limit && (
              <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setExpanded(!expanded)}>
                {expanded ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Mostrar menos
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Mostrar mais
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
