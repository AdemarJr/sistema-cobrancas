"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatarData } from "@/lib/utils"
import { handleFetchResponse, showErrorToast } from "@/lib/error-handling"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Notification {
  id: string
  titulo: string
  mensagem: string
  tipo: "INFO" | "WARNING" | "ERROR"
  lida: boolean
  link?: string
  created_at: string
}

export function Notifications() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.lida).length

  useEffect(() => {
    if (open) {
      carregarNotificacoes()
    }
  }, [open])

  const carregarNotificacoes = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/notificacoes")
      const data = await handleFetchResponse(res)
      setNotifications(data)
    } catch (error) {
      showErrorToast(error)
    } finally {
      setIsLoading(false)
    }
  }

  const marcarComoLida = async (id: string) => {
    try {
      const res = await fetch(`/api/notificacoes/${id}/ler`, {
        method: "POST",
      })
      await handleFetchResponse(res)

      // Atualiza o estado local
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, lida: true } : notif)))
    } catch (error) {
      showErrorToast(error)
    }
  }

  const marcarTodasComoLidas = async () => {
    try {
      const res = await fetch("/api/notificacoes/ler-todas", {
        method: "POST",
      })
      await handleFetchResponse(res)

      // Atualiza o estado local
      setNotifications((prev) => prev.map((notif) => ({ ...notif, lida: true })))
    } catch (error) {
      showErrorToast(error)
    }
  }

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case "WARNING":
        return "⚠️"
      case "ERROR":
        return "❌"
      default:
        return "ℹ️"
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notificações</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={marcarTodasComoLidas}>
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Carregando notificações...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Nenhuma notificação encontrada.</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b last:border-b-0 ${!notification.lida ? "bg-muted/50" : ""}`}
              >
                <div className="flex items-start gap-2">
                  <div className="text-lg">{getNotificationIcon(notification.tipo)}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{notification.titulo}</h4>
                    <p className="text-sm text-muted-foreground">{notification.mensagem}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{formatarData(notification.created_at)}</span>
                      <div className="flex gap-2">
                        {!notification.lida && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => marcarComoLida(notification.id)}
                          >
                            Marcar como lida
                          </Button>
                        )}
                        {notification.link && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            asChild
                            onClick={() => setOpen(false)}
                          >
                            <Link href={notification.link}>Ver</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-2 border-t">
          <Button variant="outline" size="sm" className="w-full" asChild onClick={() => setOpen(false)}>
            <Link href="/notificacoes">Ver todas</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
