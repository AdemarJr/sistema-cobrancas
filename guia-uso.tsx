import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Steps, Step } from "@/components/ui/steps"

export default function GuiaUso() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Guia de Uso das Novas Funcionalidades</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Analítico</CardTitle>
            <CardDescription>Como utilizar o novo dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Steps>
              <Step title="Acessar o Dashboard">
                <p className="text-sm text-muted-foreground">
                  Acesse a página inicial do sistema ou clique em "Dashboard" no menu lateral.
                </p>
              </Step>
              <Step title="Visualizar Estatísticas">
                <p className="text-sm text-muted-foreground">
                  Na parte superior, você verá cards com estatísticas importantes como total de clientes, empréstimos
                  ativos, cobranças pendentes e valor total pendente.
                </p>
              </Step>
              <Step title="Explorar Abas">
                <p className="text-sm text-muted-foreground">
                  Navegue pelas abas para ver diferentes informações:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Próximas Cobranças: cobranças com vencimento nos próximos 7 dias.</li>
                    <li>Cobranças Vencidas: cobranças que já passaram da data de vencimento.</li>
                    <li>Empréstimos Recentes: últimos empréstimos cadastrados no sistema.</li>
                  </ul>
                </p>
              </Step>
              <Step title="Ações Rápidas">
                <p className="text-sm text-muted-foreground">
                  Clique nos botões "Ver" para acessar diretamente os detalhes de um empréstimo ou cobrança.
                </p>
              </Step>
            </Steps>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sistema de Notificações</CardTitle>
            <CardDescription>Como utilizar as notificações</CardDescription>
          </CardHeader>
          <CardContent>
            <Steps>
              <Step title="Acessar Notificações">
                <p className="text-sm text-muted-foreground">
                  Clique no ícone de sino na barra de navegação para abrir o painel de notificações.
                </p>
              </Step>
              <Step title="Visualizar Notificações">
                <p className="text-sm text-muted-foreground">
                  As notificações não lidas são destacadas com um fundo cinza. Você verá o título, mensagem e data de
                  cada notificação.
                </p>
              </Step>
              <Step title="Marcar como Lida">
                <p className="text-sm text-muted-foreground">
                  Clique em "Marcar como lida" para marcar uma notificação individual como lida, ou em "Marcar todas
                  como lidas" para marcar todas de uma vez.
                </p>
              </Step>
              <Step title="Acessar Conteúdo Relacionado">
                <p className="text-sm text-muted-foreground">
                  Se a notificação tiver um link, clique em "Ver" para acessar diretamente o conteúdo relacionado à
                  notificação.
                </p>
              </Step>
            </Steps>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Atividades</CardTitle>
            <CardDescription>Como utilizar o registro de atividades</CardDescription>
          </CardHeader>
          <CardContent>
            <Steps>
              <Step title="Acessar Histórico">
                <p className="text-sm text-muted-foreground">
                  O histórico de atividades está disponível em várias partes do sistema:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Na página de detalhes de um cliente</li>
                    <li>Na página de detalhes de um empréstimo</li>
                    <li>Na página de atividades geral</li>
                  </ul>
                </p>
              </Step>
              <Step title="Filtrar Atividades">
                <p className="text-sm text-muted-foreground">
                  Use os filtros disponíveis para encontrar atividades específicas por tipo, data ou usuário.
                </p>
              </Step>
              <Step title="Expandir Detalhes">
                <p className="text-sm text-muted-foreground">
                  Clique em "Mostrar mais" para ver mais atividades além do limite inicial.
                </p>
              </Step>
              <Step title="Interpretar Ícones">
                <p className="text-sm text-muted-foreground">
                  Cada tipo de atividade tem um ícone específico para facilitar a identificação visual:
                  <ul className="list-disc pl-6 mt-2">
                    <li>👤 - Ações relacionadas a clientes</li>
                    <li>💰 - Ações relacionadas a empréstimos</li>
                    <li>📅 - Ações relacionadas a cobranças</li>
                    <li>🔑 - Ações de login/logout</li>
                  </ul>
                </p>
              </Step>
            </Steps>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios em PDF</CardTitle>
            <CardDescription>Como gerar e utilizar relatórios</CardDescription>
          </CardHeader>
          <CardContent>
            <Steps>
              <Step title="Acessar Relatórios">
                <p className="text-sm text-muted-foreground">
                  Acesse a página de relatórios ou use os botões de exportação disponíveis nas páginas de listagem e
                  detalhes.
                </p>
              </Step>
              <Step title="Selecionar Tipo de Relatório">
                <p className="text-sm text-muted-foreground">
                  Escolha entre os diferentes tipos de relatórios disponíveis:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Empréstimos em Aberto</li>
                    <li>Empréstimos Quitados</li>
                    <li>Cobranças Pendentes</li>
                    <li>Relatório por Cliente</li>
                  </ul>
                </p>
              </Step>
              <Step title="Aplicar Filtros">
                <p className="text-sm text-muted-foreground">
                  Use os filtros disponíveis para personalizar o conteúdo do relatório antes de gerá-lo.
                </p>
              </Step>
              <Step title="Visualizar e Exportar">
                <p className="text-sm text-muted-foreground">
                  Clique em "Visualizar" para ver uma prévia do relatório em PDF, ou em "Exportar PDF" para baixar o
                  arquivo diretamente.
                </p>
              </Step>
            </Steps>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
