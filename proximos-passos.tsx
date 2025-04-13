import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Circle } from "lucide-react"

export default function ProximosPassos() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Próximos Passos e Melhorias Futuras</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Fase 4: Integrações</CardTitle>
            <CardDescription>Integração com serviços externos</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Integração com Serviços de SMS</p>
                  <p className="text-sm text-muted-foreground">
                    Envio automático de lembretes de pagamento e notificações de vencimento via SMS.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Integração com E-mail</p>
                  <p className="text-sm text-muted-foreground">
                    Envio de relatórios, comprovantes e notificações por e-mail.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Integração com Serviços de Pagamento</p>
                  <p className="text-sm text-muted-foreground">
                    Recebimento de pagamentos online via PIX, boleto ou cartão de crédito.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Integração com Serviços de Consulta de Crédito</p>
                  <p className="text-sm text-muted-foreground">
                    Consulta automática de score de crédito e histórico financeiro de clientes.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fase 5: Análise Avançada</CardTitle>
            <CardDescription>Recursos avançados de análise de dados</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Dashboard Analítico Avançado</p>
                  <p className="text-sm text-muted-foreground">
                    Gráficos e visualizações avançadas para análise de tendências e desempenho.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Previsão de Inadimplência</p>
                  <p className="text-sm text-muted-foreground">
                    Algoritmos de machine learning para prever riscos de inadimplência.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Segmentação de Clientes</p>
                  <p className="text-sm text-muted-foreground">
                    Classificação automática de clientes por perfil de risco e comportamento.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Relatórios Personalizáveis</p>
                  <p className="text-sm text-muted-foreground">
                    Criação de relatórios personalizados com métricas e filtros definidos pelo usuário.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fase 6: Aplicativo Móvel</CardTitle>
            <CardDescription>Versão mobile do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Aplicativo para iOS e Android</p>
                  <p className="text-sm text-muted-foreground">
                    Versão mobile completa do sistema para acesso em qualquer lugar.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Notificações Push</p>
                  <p className="text-sm text-muted-foreground">
                    Alertas em tempo real sobre vencimentos, pagamentos e outras atividades.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Captura de Documentos</p>
                  <p className="text-sm text-muted-foreground">
                    Uso da câmera para capturar documentos e comprovantes de pagamento.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Modo Offline</p>
                  <p className="text-sm text-muted-foreground">
                    Funcionamento básico mesmo sem conexão com a internet.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fase 7: Personalização e Escalabilidade</CardTitle>
            <CardDescription>Melhorias na personalização e escalabilidade</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Temas Personalizáveis</p>
                  <p className="text-sm text-muted-foreground">Personalização de cores, logos e layout do sistema.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Múltiplas Empresas</p>
                  <p className="text-sm text-muted-foreground">
                    Suporte para gerenciar múltiplas empresas ou filiais no mesmo sistema.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Controle de Acesso Avançado</p>
                  <p className="text-sm text-muted-foreground">
                    Permissões granulares para diferentes tipos de usuários e funções.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">API Pública</p>
                  <p className="text-sm text-muted-foreground">
                    API para integração com outros sistemas e desenvolvimento de extensões.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
