"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { formatarData, formatarMoeda } from "@/lib/utils"
import type { Pessoa } from "@/types/database"
import { PDFExportButtons } from "@/components/pdf-generator"

export default function RelatoriosPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("emprestimos")

  // Estados para filtros
  const [buscaEmprestimos, setBuscaEmprestimos] = useState("")
  const [buscaQuitados, setBuscaQuitados] = useState("")
  const [dataInicioQuitados, setDataInicioQuitados] = useState("")
  const [dataFimQuitados, setDataFimQuitados] = useState("")
  const [buscaCobrancas, setBuscaCobrancas] = useState("")
  const [statusCobrancas, setStatusCobrancas] = useState("")
  const [pessoaSelecionada, setPessoaSelecionada] = useState("")

  // Estados para dados
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [emprestimosAbertos, setEmprestimosAbertos] = useState<any[]>([])
  const [emprestimosQuitados, setEmprestimosQuitados] = useState<any[]>([])
  const [cobrancasPendentes, setCobrancasPendentes] = useState<any[]>([])
  const [relatorioPessoa, setRelatorioPessoa] = useState<any>(null)

  // Estados de carregamento
  const [isLoadingPessoas, setIsLoadingPessoas] = useState(false)
  const [isLoadingEmprestimos, setIsLoadingEmprestimos] = useState(false)
  const [isLoadingQuitados, setIsLoadingQuitados] = useState(false)
  const [isLoadingCobrancas, setIsLoadingCobrancas] = useState(false)
  const [isLoadingPessoa, setIsLoadingPessoa] = useState(false)

  // Carregar pessoas para o select
  useEffect(() => {
    const carregarPessoas = async () => {
      try {
        setIsLoadingPessoas(true)
        const res = await fetch("/api/pessoas")

        if (!res.ok) {
          throw new Error("Erro ao carregar pessoas")
        }

        const data = await res.json()
        setPessoas(data)
      } catch (error) {
        console.error("Erro:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de pessoas.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingPessoas(false)
      }
    }

    carregarPessoas()
  }, [toast])

  // Carregar dados quando a tab mudar
  useEffect(() => {
    if (activeTab === "emprestimos") {
      carregarEmprestimosAbertos()
    } else if (activeTab === "quitados") {
      carregarEmprestimosQuitados()
    } else if (activeTab === "cobrancas") {
      carregarCobrancasPendentes()
    } else if (activeTab === "pessoa" && pessoaSelecionada) {
      carregarRelatorioPessoa()
    }
  }, [activeTab])

  const carregarEmprestimosAbertos = async () => {
    try {
      setIsLoadingEmprestimos(true)

      const url = `/api/relatorios/emprestimos-abertos?busca=${encodeURIComponent(buscaEmprestimos)}`

      const res = await fetch(url)

      if (!res.ok) {
        throw new Error("Erro ao carregar relatório")
      }

      const data = await res.json()
      setEmprestimosAbertos(data)
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar o relatório.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingEmprestimos(false)
    }
  }

  const carregarEmprestimosQuitados = async () => {
    try {
      setIsLoadingQuitados(true)

      let url = `/api/relatorios/emprestimos-quitados?busca=${encodeURIComponent(buscaQuitados)}`

      if (dataInicioQuitados) {
        url += `&dataInicio=${encodeURIComponent(dataInicioQuitados)}`
      }

      if (dataFimQuitados) {
        url += `&dataFim=${encodeURIComponent(dataFimQuitados)}`
      }

      const res = await fetch(url)

      if (!res.ok) {
        throw new Error("Erro ao carregar relatório")
      }

      const data = await res.json()
      setEmprestimosQuitados(data)
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar o relatório.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingQuitados(false)
    }
  }

  const carregarCobrancasPendentes = async () => {
    try {
      setIsLoadingCobrancas(true)

      const url = `/api/relatorios/cobrancas-pendentes?busca=${encodeURIComponent(buscaCobrancas)}&status=${encodeURIComponent(statusCobrancas)}`

      const res = await fetch(url)

      if (!res.ok) {
        throw new Error("Erro ao carregar relatório")
      }

      const data = await res.json()
      setCobrancasPendentes(data)
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar o relatório.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingCobrancas(false)
    }
  }

  const carregarRelatorioPessoa = async () => {
    if (!pessoaSelecionada) return

    try {
      setIsLoadingPessoa(true)

      const res = await fetch(`/api/relatorios/por-pessoa/${pessoaSelecionada}`)

      if (!res.ok) {
        throw new Error("Erro ao carregar relatório")
      }

      const data = await res.json()
      setRelatorioPessoa(data)
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar o relatório.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingPessoa(false)
    }
  }

  const formatarTipoCobranca = (tipo: string) => {
    const tipos = {
      DIARIA: "Diária",
      SEMANAL: "Semanal",
      MENSAL: "Mensal",
    }
    return tipos[tipo as keyof typeof tipos] || tipo
  }

  const formatarStatus = (status: string) => {
    const statusMap = {
      EM_ANDAMENTO: "Em andamento",
      QUITADO: "Quitado",
      PENDENTE: "Pendente",
      PAGO: "Pago",
      VENCIDO: "Vencido",
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Relatórios</h1>

      <Tabs defaultValue="emprestimos" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="emprestimos">Empréstimos em Aberto</TabsTrigger>
          <TabsTrigger value="quitados">Empréstimos Quitados</TabsTrigger>
          <TabsTrigger value="cobrancas">Cobranças</TabsTrigger>
          <TabsTrigger value="pessoa">Por Pessoa</TabsTrigger>
        </TabsList>

        {/* Relatório de Empréstimos em Aberto */}
        <TabsContent value="emprestimos">
          <Card>
            <CardHeader>
              <CardTitle>Empréstimos em Aberto</CardTitle>
              <CardDescription>Lista de todos os empréstimos que ainda estão em andamento.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="Nome ou CPF do cliente"
                    className="sm:max-w-xs"
                    value={buscaEmprestimos}
                    onChange={(e) => setBuscaEmprestimos(e.target.value)}
                  />
                  <Button variant="secondary" onClick={carregarEmprestimosAbertos} disabled={isLoadingEmprestimos}>
                    <Search className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                  <div className="flex gap-2 ml-auto">
                    {emprestimosAbertos.length > 0 && (
                      <PDFExportButtons data={emprestimosAbertos} type="emprestimos-abertos" />
                    )}
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Data Início</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Parcelas Pagas</TableHead>
                      <TableHead>Parcelas Totais</TableHead>
                      <TableHead>Valor Restante</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingEmprestimos ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Carregando...
                        </TableCell>
                      </TableRow>
                    ) : emprestimosAbertos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Nenhum empréstimo em aberto encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      emprestimosAbertos.map((emprestimo) => (
                        <TableRow key={emprestimo.id}>
                          <TableCell className="font-medium">{emprestimo.pessoa.nome}</TableCell>
                          <TableCell>{formatarMoeda(Number(emprestimo.valor))}</TableCell>
                          <TableCell>{formatarData(emprestimo.data_inicio)}</TableCell>
                          <TableCell>{formatarTipoCobranca(emprestimo.tipo_cobranca)}</TableCell>
                          <TableCell>{emprestimo.parcelas_pagas}</TableCell>
                          <TableCell>{emprestimo.parcelas}</TableCell>
                          <TableCell>{formatarMoeda(emprestimo.valor_restante)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório de Empréstimos Quitados */}
        <TabsContent value="quitados">
          <Card>
            <CardHeader>
              <CardTitle>Empréstimos Quitados</CardTitle>
              <CardDescription>Lista de todos os empréstimos que foram completamente pagos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="Nome ou CPF do cliente"
                    className="sm:max-w-xs"
                    value={buscaQuitados}
                    onChange={(e) => setBuscaQuitados(e.target.value)}
                  />
                  <Input
                    type="date"
                    placeholder="Data inicial"
                    className="sm:max-w-xs"
                    value={dataInicioQuitados}
                    onChange={(e) => setDataInicioQuitados(e.target.value)}
                  />
                  <Input
                    type="date"
                    placeholder="Data final"
                    className="sm:max-w-xs"
                    value={dataFimQuitados}
                    onChange={(e) => setDataFimQuitados(e.target.value)}
                  />
                  <Button variant="secondary" onClick={carregarEmprestimosQuitados} disabled={isLoadingQuitados}>
                    <Search className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                  <div className="flex gap-2 ml-auto"></div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Data Início</TableHead>
                      <TableHead>Data Quitação</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Parcelas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingQuitados ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Carregando...
                        </TableCell>
                      </TableRow>
                    ) : emprestimosQuitados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Nenhum empréstimo quitado encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      emprestimosQuitados.map((emprestimo) => (
                        <TableRow key={emprestimo.id}>
                          <TableCell className="font-medium">{emprestimo.pessoa.nome}</TableCell>
                          <TableCell>{formatarMoeda(Number(emprestimo.valor))}</TableCell>
                          <TableCell>{formatarData(emprestimo.data_inicio)}</TableCell>
                          <TableCell>
                            {emprestimo.data_quitacao ? formatarData(emprestimo.data_quitacao) : "-"}
                          </TableCell>
                          <TableCell>{formatarTipoCobranca(emprestimo.tipo_cobranca)}</TableCell>
                          <TableCell>{emprestimo.parcelas}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório de Cobranças */}
        <TabsContent value="cobrancas">
          <Card>
            <CardHeader>
              <CardTitle>Cobranças Vencidas e a Vencer</CardTitle>
              <CardDescription>Lista de todas as cobranças pendentes e vencidas.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="Nome ou CPF do cliente"
                    className="sm:max-w-xs"
                    value={buscaCobrancas}
                    onChange={(e) => setBuscaCobrancas(e.target.value)}
                  />
                  <Select value={statusCobrancas} onValueChange={setStatusCobrancas}>
                    <SelectTrigger className="sm:max-w-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TODOS">Todos</SelectItem>
                      <SelectItem value="PENDENTE">Pendente</SelectItem>
                      <SelectItem value="VENCIDO">Vencido</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="secondary" onClick={carregarCobrancasPendentes} disabled={isLoadingCobrancas}>
                    <Search className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                  <div className="flex gap-2 ml-auto">
                    {cobrancasPendentes.length > 0 && (
                      <PDFExportButtons data={cobrancasPendentes} type="cobrancas-pendentes" />
                    )}
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Empréstimo</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Dias Vencidos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingCobrancas ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Carregando...
                        </TableCell>
                      </TableRow>
                    ) : cobrancasPendentes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Nenhuma cobrança pendente ou vencida encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      cobrancasPendentes.map((cobranca) => (
                        <TableRow key={cobranca.id}>
                          <TableCell className="font-medium">{cobranca.emprestimo.pessoa.nome}</TableCell>
                          <TableCell>Empréstimo #{cobranca.emprestimo.id.substring(0, 8)}</TableCell>
                          <TableCell>{formatarMoeda(Number(cobranca.valor))}</TableCell>
                          <TableCell>{formatarData(cobranca.data_vencimento)}</TableCell>
                          <TableCell>
                            <Badge variant={cobranca.status === "VENCIDO" ? "destructive" : "default"}>
                              {formatarStatus(cobranca.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>{cobranca.dias_vencidos || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório por Pessoa */}
        <TabsContent value="pessoa">
          <Card>
            <CardHeader>
              <CardTitle>Relatório por Pessoa</CardTitle>
              <CardDescription>Detalhes de empréstimos e cobranças por cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select
                    value={pessoaSelecionada}
                    onValueChange={(value) => {
                      setPessoaSelecionada(value)
                      setRelatorioPessoa(null)
                    }}
                  >
                    <SelectTrigger className="sm:max-w-xs">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {pessoas.map((pessoa) => (
                        <SelectItem key={pessoa.id} value={pessoa.id}>
                          {pessoa.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="secondary"
                    onClick={carregarRelatorioPessoa}
                    disabled={isLoadingPessoa || !pessoaSelecionada}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                  </Button>
                  <div className="flex gap-2 ml-auto">
                    {relatorioPessoa && <PDFExportButtons data={relatorioPessoa} type="pessoa" />}
                  </div>
                </div>

                {isLoadingPessoa ? (
                  <div className="text-center py-4">Carregando...</div>
                ) : !relatorioPessoa ? (
                  pessoaSelecionada ? (
                    <div className="text-center py-4">Clique em "Buscar" para carregar os dados.</div>
                  ) : (
                    <div className="text-center py-4">Selecione um cliente para visualizar o relatório.</div>
                  )
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Dados do Cliente</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p>
                            <strong>Nome:</strong> {relatorioPessoa.pessoa.nome}
                          </p>
                          <p>
                            <strong>CPF:</strong> {relatorioPessoa.pessoa.cpf}
                          </p>
                          <p>
                            <strong>RG:</strong> {relatorioPessoa.pessoa.rg}
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Telefone:</strong> {relatorioPessoa.pessoa.telefone}
                          </p>
                          <p>
                            <strong>Endereço:</strong> {relatorioPessoa.pessoa.endereco},{" "}
                            {relatorioPessoa.pessoa.cidade}/{relatorioPessoa.pessoa.estado}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Resumo</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p>
                            <strong>Total de Empréstimos:</strong> {relatorioPessoa.estatisticas.total_emprestimos}
                          </p>
                          <p>
                            <strong>Em Andamento:</strong> {relatorioPessoa.estatisticas.emprestimos_em_andamento}
                          </p>
                          <p>
                            <strong>Quitados:</strong> {relatorioPessoa.estatisticas.emprestimos_quitados}
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Valor Total Emprestado:</strong>{" "}
                            {formatarMoeda(relatorioPessoa.estatisticas.valor_total_emprestado)}
                          </p>
                          <p>
                            <strong>Valor Total Pago:</strong>{" "}
                            {formatarMoeda(relatorioPessoa.estatisticas.valor_total_pago)}
                          </p>
                          <p>
                            <strong>Valor Total Pendente:</strong>{" "}
                            {formatarMoeda(relatorioPessoa.estatisticas.valor_total_pendente)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Empréstimos</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Valor Total</TableHead>
                            <TableHead>Data Início</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Parcelas Pagas</TableHead>
                            <TableHead>Parcelas Totais</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {relatorioPessoa.emprestimos.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-4">
                                Nenhum empréstimo encontrado.
                              </TableCell>
                            </TableRow>
                          ) : (
                            relatorioPessoa.emprestimos.map((emprestimo: any) => (
                              <TableRow key={emprestimo.id}>
                                <TableCell>{emprestimo.id.substring(0, 8)}</TableCell>
                                <TableCell>{formatarMoeda(Number(emprestimo.valor))}</TableCell>
                                <TableCell>{formatarData(emprestimo.data_inicio)}</TableCell>
                                <TableCell>{formatarTipoCobranca(emprestimo.tipo_cobranca)}</TableCell>
                                <TableCell>
                                  <Badge variant={emprestimo.status === "QUITADO" ? "outline" : "default"}>
                                    {formatarStatus(emprestimo.status)}
                                  </Badge>
                                </TableCell>
                                <TableCell>{emprestimo.parcelas_pagas}</TableCell>
                                <TableCell>{emprestimo.parcelas}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {relatorioPessoa.emprestimos.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Cobranças</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Empréstimo</TableHead>
                              <TableHead>Valor</TableHead>
                              <TableHead>Vencimento</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Data Pagamento</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {relatorioPessoa.emprestimos.flatMap((emprestimo: any) =>
                              emprestimo.cobrancas.map((cobranca: any) => (
                                <TableRow key={cobranca.id}>
                                  <TableCell>{emprestimo.id.substring(0, 8)}</TableCell>
                                  <TableCell>{formatarMoeda(Number(cobranca.valor))}</TableCell>
                                  <TableCell>{formatarData(cobranca.data_vencimento)}</TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        cobranca.status === "PAGO"
                                          ? "outline"
                                          : cobranca.status === "VENCIDO"
                                            ? "destructive"
                                            : "default"
                                      }
                                    >
                                      {formatarStatus(cobranca.status)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {cobranca.data_pagamento ? formatarData(cobranca.data_pagamento) : "-"}
                                  </TableCell>
                                </TableRow>
                              )),
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
