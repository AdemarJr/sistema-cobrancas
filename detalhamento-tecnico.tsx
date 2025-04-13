"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function DetalhamentoTecnico() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Detalhamento Técnico das Melhorias</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Componentes e Funcionalidades Implementadas</CardTitle>
          <CardDescription>Detalhes técnicos das principais implementações</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Componentes de UI Reutilizáveis</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">DataTable</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Componente genérico para exibição de dados tabulares com suporte para paginação, ordenação e
                      filtragem. Aceita colunas personalizadas e funções de renderização para células específicas.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`<DataTable
  data={data}
  columns={columns}
  isLoading={isLoading}
  searchPlaceholder="Buscar cliente..."
  searchFunction={searchFunction}
  pagination={true}
  initialPageSize={10}
/>`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold">StatsCard</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Componente para exibição de estatísticas em cards, com suporte para ícones, tendências e
                      descrições. Útil para dashboards e resumos.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`<StatsCard
  title="Total de Clientes"
  value={totalClientes}
  icon={<Users />}
  trend={{
    value: 5.2,
    isPositive: true,
    label: "em relação ao mês anterior"
  }}
/>`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold">ConfirmationDialog</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Componente para confirmação de ações destrutivas ou importantes, com suporte para personalização
                      de mensagens e botões.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`<ConfirmationDialog
  title="Confirmar exclusão"
  description="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
  actionText="Excluir"
  cancelText="Cancelar"
  onConfirm={handleExcluir}
  destructive={true}
>
  <Button variant="outline" size="icon">
    <Trash2 className="h-4 w-4" />
  </Button>
</ConfirmationDialog>`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold">Notifications</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Componente para exibição de notificações do sistema, com suporte para diferentes tipos de
                      notificações e marcação como lidas.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">{`<Notifications />`}</pre>
                  </div>

                  <div>
                    <h3 className="font-semibold">ActivityLog</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Componente para exibição do histórico de atividades, com suporte para filtragem por cliente ou
                      empréstimo.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`<ActivityLog clienteId={cliente.id} limit={5} />`}
                    </pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Utilitários e Funções Auxiliares</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Tratamento de Erros</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Funções para tratamento centralizado de erros, com suporte para diferentes tipos de erros e
                      exibição de mensagens amigáveis.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`// Tratamento de erros de API
try {
  const data = await handleFetchResponse(res);
  // Processar dados
} catch (error) {
  showErrorToast(error);
}`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold">Validação de Dados</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Funções para validação de dados usando Zod, com suporte para validação de CPF, CNPJ e outros
                      campos específicos.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`// Validação de requisições
export async function POST(req: NextRequest) {
  const validation = await validateRequest(req, clienteSchema);
  if (!validation.success) {
    return validation.error;
  }
  // Processar dados validados
}`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold">Formatação de Dados</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Funções para formatação de dados como datas, valores monetários, telefones e documentos.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`// Formatação de dados
formatarData(emprestimo.data_inicio)
formatarMoeda(Number(emprestimo.valor))
formatarTelefone(cliente.telefone_principal)
formatarDocumento(cliente.tipo_documento, cliente.documento)`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold">Consultas ao Banco de Dados</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Funções para construção de consultas otimizadas ao banco de dados, com suporte para paginação e
                      ordenação.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`// Consulta paginada
const query = supabase.from("clientes").select("*");
const paginatedQuery = buildPaginatedQuery(query, {
  page: 1,
  pageSize: 10,
  orderBy: "nome_completo",
  orderDirection: "asc"
});
const { data, error } = await paginatedQuery;`}
                    </pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Novas Tabelas e Funções no Banco de Dados</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Tabela de Notificações</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Armazena notificações do sistema para os usuários, com campos para título, mensagem, tipo, link e
                      status de leitura.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`CREATE TABLE notificacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL DEFAULT 'INFO',
  link VARCHAR(255),
  lida BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold">Tabela de Atividades</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Registra todas as ações realizadas no sistema, com campos para usuário, ação, entidade, detalhes e
                      data.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`CREATE TABLE atividades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  acao VARCHAR(50) NOT NULL,
  entidade VARCHAR(50) NOT NULL,
  entidade_id UUID,
  detalhes JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold">Funções SQL para Cálculos Financeiros</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Funções SQL para cálculos financeiros como valor total emprestado, valor total pendente e valor
                      total recebido.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`-- Exemplo de função SQL
CREATE OR REPLACE FUNCTION calcular_valor_total_pendente()
RETURNS TABLE (valor DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT COALESCE(SUM(c.valor), 0) AS valor
  FROM cobrancas c
  WHERE c.status IN ('PENDENTE', 'VENCIDO');
END;
$$ LANGUAGE plpgsql;`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold">Triggers para Registro de Atividades</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Triggers que registram automaticamente atividades quando ocorrem alterações nas tabelas
                      principais.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`-- Exemplo de trigger
CREATE OR REPLACE FUNCTION registrar_atividade_cliente()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO atividades (usuario_id, acao, entidade, entidade_id, detalhes)
    VALUES (auth.uid(), 'criar', 'cliente', NEW.id, row_to_json(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO atividades (usuario_id, acao, entidade, entidade_id, detalhes)
    VALUES (auth.uid(), 'atualizar', 'cliente', NEW.id, row_to_json(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO atividades (usuario_id, acao, entidade, entidade_id, detalhes)
    VALUES (auth.uid(), 'excluir', 'cliente', OLD.id, row_to_json(OLD));
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;`}
                    </pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>APIs e Endpoints</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">API de Dashboard</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Endpoint que retorna dados para o dashboard, incluindo estatísticas, cobranças próximas, cobranças
                      vencidas e empréstimos recentes.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">{`GET /api/dashboard`}</pre>
                  </div>

                  <div>
                    <h3 className="font-semibold">API de Notificações</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Endpoints para gerenciar notificações, incluindo listagem, criação, marcação como lida e marcação
                      de todas como lidas.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`GET /api/notificacoes
POST /api/notificacoes
POST /api/notificacoes/{id}/ler
POST /api/notificacoes/ler-todas`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold">API de Atividades</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Endpoints para gerenciar o histórico de atividades, incluindo listagem filtrada e registro de
                      novas atividades.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`GET /api/atividades?clienteId={id}&emprestimoId={id}&limit={limit}
POST /api/atividades`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold">APIs de Clientes</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Endpoints para gerenciar clientes, com validação aprimorada e tratamento de erros mais robusto.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`GET /api/clientes
POST /api/clientes
GET /api/clientes/{id}
PUT /api/clientes/{id}
DELETE /api/clientes/{id}`}
                    </pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Segurança e Autenticação</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Middleware de Autenticação</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Middleware que verifica a autenticação do usuário em todas as rotas protegidas e registra
                      atividades de login/logout.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`// Middleware de autenticação
export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const { data: { session } } = await supabase.auth.getSession();
  
  // Verificação de autenticação e redirecionamento
  // ...
  
  return res;
}`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold">Validação de Requisições</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Função para validar requisições HTTP usando Zod, garantindo que os dados recebidos estejam no
                      formato esperado.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`// Validação de requisições
export async function validateRequest<T>(
  req: NextRequest,
  schema: z.ZodType<T>
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    // Tratamento de erros de validação
    // ...
  }
}`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold">Proteção de Rotas</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Componente que protege rotas do cliente, redirecionando para a página de login se o usuário não
                      estiver autenticado.
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-auto">
                      {`// Proteção de rotas no cliente
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Renderização condicional
  // ...
}`}
                    </pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
