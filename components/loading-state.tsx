import { Loader2 } from "lucide-react"

interface LoadingStateProps {
  text?: string
  fullPage?: boolean
  size?: "sm" | "md" | "lg"
}

export function LoadingState({ text = "Carregando...", fullPage = false, size = "md" }: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  )

  if (fullPage) {
    return <div className="flex items-center justify-center min-h-screen">{content}</div>
  }

  return content
}
