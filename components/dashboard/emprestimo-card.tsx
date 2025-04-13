import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SafeLink } from "@/components/ui/safe-link"
import { formatarData, formatarMoeda } from "@/lib/formatters"

interface EmprestimoCardProps {
  emprestimo: {
    id: string
    valor: number
    data_inicio: string
    status: string
    parcelas: number
    pessoa: {
      id: string
      nome: string
    }
  }
}

export function EmprestimoCard({ emprestimo }: EmprestimoCardProps) {
  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium flex justify-between">
          <span>{emprestimo.pessoa.nome}</span>
          <span>{formatarMoeda(Number(emprestimo.valor))}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Data de início:</span>
          <span>{formatarData(emprestimo.data_inicio)}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Parcelas:</span>
          <span>{emprestimo.parcelas}x</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Status:</span>
          <span className={emprestimo.status === "QUITADO" ? "text-green-500" : "text-blue-500"}>
            {emprestimo.status === "QUITADO" ? "Quitado" : "Em andamento"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-muted/50">
        <Button asChild variant="ghost" size="sm" className="w-full text-xs">
          <SafeLink
            href={`/emprestimos/${emprestimo.id}`}
            tipo="emprestimo"
            id={emprestimo.id}
            fallbackUrl="/emprestimos"
          >
            Ver Detalhes
          </SafeLink>
        </Button>
      </CardFooter>
    </Card>
  )
}
