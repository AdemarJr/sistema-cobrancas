import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Verificar autenticação
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirecionar para login se não estiver autenticado
  if (
    !session &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/cadastro") &&
    !request.nextUrl.pathname.startsWith("/esqueci-senha") &&
    !request.nextUrl.pathname.startsWith("/redefinir-senha") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verificar se a rota de detalhes existe
  // Importante: Não verificar rotas de cadastro e outras rotas especiais
  const detailsRoutePattern = /^\/(clientes|emprestimos|cobrancas)\/([^/]+)$/
  const match = request.nextUrl.pathname.match(detailsRoutePattern)

  // Ignorar rotas de cadastro e edição
  if (
    match &&
    session &&
    !request.nextUrl.pathname.endsWith("/cadastrar") &&
    !request.nextUrl.pathname.endsWith("/editar")
  ) {
    const [, tipo, id] = match

    // Mapear o tipo para a tabela correspondente
    const tabela = tipo === "clientes" ? "pessoas" : tipo === "emprestimos" ? "emprestimos" : "cobrancas"

    // Verificar se o registro existe
    const { data, error } = await supabase.from(tabela).select("id").eq("id", id).single()

    if (error || !data) {
      // Registrar o erro para análise
      console.error(`Erro 404: ${tipo}/${id} não encontrado`, error)

      // Redirecionar para a página 404 personalizada
      return NextResponse.rewrite(new URL("/not-found", request.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}
