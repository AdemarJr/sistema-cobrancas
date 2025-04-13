import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

/**
 * Verifica se uma entidade existe antes de navegar para sua página de detalhes
 * @param tipo Tipo de entidade (cliente, emprestimo, cobranca)
 * @param id ID da entidade
 * @returns Booleano indicando se a entidade existe
 */
export async function verificarEntidadeExiste(
  tipo: "cliente" | "emprestimo" | "cobranca",
  id: string,
): Promise<boolean> {
  if (!id) return false

  // Não verificar rotas especiais
  if (id === "cadastrar" || id === "editar") {
    return true
  }

  const supabase = createClientComponentClient()

  try {
    let { data, error } = { data: null, error: null }

    switch (tipo) {
      case "cliente":
        ;({ data, error } = await supabase.from("pessoas").select("id").eq("id", id).single())
        break
      case "emprestimo":
        ;({ data, error } = await supabase.from("emprestimos").select("id").eq("id", id).single())
        break
      case "cobranca":
        ;({ data, error } = await supabase.from("cobrancas").select("id").eq("id", id).single())
        break
    }

    if (error) {
      console.error(`Erro ao verificar ${tipo}:`, error)
      return false
    }

    return !!data
  } catch (error) {
    console.error(`Erro ao verificar ${tipo}:`, error)
    return false
  }
}

/**
 * Constrói uma URL segura, verificando se a entidade existe antes de retornar a URL
 * @param baseUrl URL base (ex: /clientes, /emprestimos)
 * @param id ID da entidade
 * @param fallbackUrl URL de fallback caso a entidade não exista
 * @returns URL segura
 */
export function construirUrlSegura(baseUrl: string, id?: string, fallbackUrl = "/"): string {
  if (!id) return fallbackUrl

  // Não verificar rotas especiais
  if (id === "cadastrar" || id === "editar") {
    return `${baseUrl}/${id}`
  }

  return `${baseUrl}/${id}`
}

/**
 * Hook para navegação segura, verificando se a entidade existe antes de navegar
 * @param router Objeto router do Next.js
 * @param tipo Tipo de entidade
 * @param id ID da entidade
 * @param fallbackUrl URL de fallback caso a entidade não exista
 */
export async function navegarComVerificacao(
  router: any,
  tipo: "cliente" | "emprestimo" | "cobranca",
  id: string,
  baseUrl: string,
  fallbackUrl = "/",
  toast?: any,
): Promise<void> {
  if (!id) {
    if (toast) toast({ title: "Erro", description: `ID de ${tipo} inválido`, variant: "destructive" })
    router.push(fallbackUrl)
    return
  }

  // Não verificar rotas especiais
  if (id === "cadastrar" || id === "editar") {
    router.push(`${baseUrl}/${id}`)
    return
  }

  const existe = await verificarEntidadeExiste(tipo, id)

  if (existe) {
    router.push(`${baseUrl}/${id}`)
  } else {
    if (toast)
      toast({
        title: "Erro",
        description: `O ${tipo} solicitado não foi encontrado ou foi excluído`,
        variant: "destructive",
      })
    router.push(fallbackUrl)
  }
}
