"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const res = await fetch("/api/health-check")

        if (res.ok) {
          const data = await res.json()
          setStatus("connected")
          setMessage(data.message || "Banco de dados conectado com sucesso!")
        } else {
          const data = await res.json()
          setStatus("error")
          setMessage(data.error || "Erro ao conectar ao banco de dados")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Não foi possível verificar a conexão com o banco de dados")
      }
    }

    checkDatabase()
  }, [])

  if (status === "loading") {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Verificando conexão com o banco de dados...</AlertTitle>
      </Alert>
    )
  }

  if (status === "error") {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro de conexão</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-4 bg-green-50 border-green-200">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-600">Conectado</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
