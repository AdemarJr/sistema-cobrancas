import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SafeLink } from "@/components/ui/safe-link"
import { formatarData, formatarMoeda } from "@/lib/formatters"

interface CobrancaCardProps {
  cobranca: {
    id: string
    valor: number
    data_vencimento: string
    status: string
    emprestimo_id: string
    emprestimo: {
      id: string
      pessoa: {
        id: string
        nome: string
      }
    }
  }
  tipo: "proxima" | "vencida"
}

export function CobrancaCard({ cobranca, tipo }: CobrancaCardProps) {
  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium flex justify-between">
          <span>{cobranca.emprestimo.pessoa.nome}</span>
          <span className={tipo === "vencida" ? "text-red-500" : "text-amber-500"}>
            {formatarMoeda(Number(cobranca.valor))}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Vencimento:</span>
          <span>{formatarData(cobranca.data_vencimento)}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Status:</span>
          <span className={tipo === "vencida" ? "text-red-500" : "text-amber-500"}>
            {tipo === "vencida" ? "Vencida" : "Pendente"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-muted/50">
        <Button asChild variant="ghost" size="sm" className="w-full text-xs">
          <SafeLink
            href={`/emprestimos/${cobranca.emprestimo_id}`}
            tipo="emprestimo"
            id={cobranca.emprestimo_id}
            fallbackUrl="/emprestimos"
          >
            Ver Empréstimo
          </SafeLink>
        </Button>
      </CardFooter>
    </Card>
  )
}
