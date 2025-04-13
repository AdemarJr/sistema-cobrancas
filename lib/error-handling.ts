import { toast } from "@/hooks/use-toast"

export type ApiError = {
  status: number
  message: string
  details?: string
}

export function handleApiError(error: unknown): ApiError {
  console.error("API Error:", error)

  // Se o erro já for do tipo ApiError, retorne-o
  if (typeof error === "object" && error !== null && "status" in error && "message" in error) {
    return error as ApiError
  }

  // Se for um erro do Supabase
  if (typeof error === "object" && error !== null && "code" in error && "message" in error) {
    const supabaseError = error as { code: string; message: string; details?: string }
    return {
      status: 400,
      message: supabaseError.message,
      details: supabaseError.details,
    }
  }

  // Se for um erro com mensagem
  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message,
      details: error.stack,
    }
  }

  // Erro genérico
  return {
    status: 500,
    message: "Ocorreu um erro inesperado",
    details: String(error),
  }
}

export function showErrorToast(error: unknown) {
  const apiError = handleApiError(error)
  toast({
    title: "Erro",
    description: apiError.message,
    variant: "destructive",
  })
}

export async function handleFetchResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw {
      status: response.status,
      message: errorData.error || `Erro ${response.status}: ${response.statusText}`,
      details: errorData.details,
    }
  }
  return response.json()
}
