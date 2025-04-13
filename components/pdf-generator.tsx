"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown, Printer, Loader2 } from "lucide-react"
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, PDFViewer, Font } from "@react-pdf/renderer"
import { formatarData, formatarMoeda } from "@/lib/utils"

// Registrar fontes
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
})

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
    fontFamily: "Roboto",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#f3f4f6",
    padding: 5,
  },
  table: {
    display: "flex",
    width: "auto",
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
  },
  tableCell: {
    padding: 5,
    flex: 1,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#DDD",
  },
  tableCellLast: {
    padding: 5,
    flex: 1,
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    paddingTop: 10,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: "bold",
    width: 120,
    fontSize: 12,
  },
  infoValue: {
    flex: 1,
    fontSize: 12,
  },
})

// Componente para relatório de empréstimos em aberto
const EmprestimosAbertosReport = ({ data, dataAtual }: { data: any[]; dataAtual: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Relatório de Empréstimos em Aberto</Text>
        <Text style={styles.subtitle}>Data de geração: {dataAtual}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total de empréstimos:</Text>
          <Text style={styles.infoValue}>{data.length}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Valor total:</Text>
          <Text style={styles.infoValue}>
            {formatarMoeda(data.reduce((total, emp) => total + Number(emp.valor), 0))}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Empréstimos</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Cliente</Text>
            <Text style={styles.tableCell}>Valor</Text>
            <Text style={styles.tableCell}>Data Início</Text>
            <Text style={styles.tableCell}>Parcelas Pagas</Text>
            <Text style={styles.tableCellLast}>Valor Restante</Text>
          </View>

          {data.map((emprestimo, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{emprestimo.pessoa?.nome}</Text>
              <Text style={styles.tableCell}>{formatarMoeda(Number(emprestimo.valor))}</Text>
              <Text style={styles.tableCell}>{formatarData(emprestimo.data_inicio)}</Text>
              <Text style={styles.tableCell}>
                {emprestimo.parcelas_pagas} / {emprestimo.parcelas}
              </Text>
              <Text style={styles.tableCellLast}>{formatarMoeda(emprestimo.valor_restante)}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.footer}>Sistema de Cobrança - Relatório gerado em {dataAtual}</Text>
    </Page>
  </Document>
)

// Componente para relatório de cobranças pendentes
const CobrancasPendentesReport = ({ data, dataAtual }: { data: any[]; dataAtual: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Relatório de Cobranças Pendentes</Text>
        <Text style={styles.subtitle}>Data de geração: {dataAtual}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total de cobranças:</Text>
          <Text style={styles.infoValue}>{data.length}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Valor total:</Text>
          <Text style={styles.infoValue}>
            {formatarMoeda(data.reduce((total, cob) => total + Number(cob.valor), 0))}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cobranças</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Cliente</Text>
            <Text style={styles.tableCell}>Valor</Text>
            <Text style={styles.tableCell}>Vencimento</Text>
            <Text style={styles.tableCell}>Status</Text>
            <Text style={styles.tableCellLast}>Dias Vencidos</Text>
          </View>

          {data.map((cobranca, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{cobranca.emprestimo?.pessoa?.nome}</Text>
              <Text style={styles.tableCell}>{formatarMoeda(Number(cobranca.valor))}</Text>
              <Text style={styles.tableCell}>{formatarData(cobranca.data_vencimento)}</Text>
              <Text style={styles.tableCell}>{cobranca.status}</Text>
              <Text style={styles.tableCellLast}>{cobranca.dias_vencidos || "-"}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.footer}>Sistema de Cobrança - Relatório gerado em {dataAtual}</Text>
    </Page>
  </Document>
)

// Componente para relatório por pessoa
const RelatorioPessoaReport = ({ data, dataAtual }: { data: any; dataAtual: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Relatório de Cliente</Text>
        <Text style={styles.subtitle}>Data de geração: {dataAtual}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados do Cliente</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoValue}>{data.pessoa.nome}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>CPF:</Text>
          <Text style={styles.infoValue}>{data.pessoa.cpf}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Telefone:</Text>
          <Text style={styles.infoValue}>{data.pessoa.telefone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Indicado por:</Text>
          <Text style={styles.infoValue}>{data.pessoa.indicado_por || "-"}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total de empréstimos:</Text>
          <Text style={styles.infoValue}>{data.estatisticas.total_emprestimos}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Em andamento:</Text>
          <Text style={styles.infoValue}>{data.estatisticas.emprestimos_em_andamento}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Quitados:</Text>
          <Text style={styles.infoValue}>{data.estatisticas.emprestimos_quitados}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Valor total emprestado:</Text>
          <Text style={styles.infoValue}>{formatarMoeda(data.estatisticas.valor_total_emprestado)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Valor total pago:</Text>
          <Text style={styles.infoValue}>{formatarMoeda(data.estatisticas.valor_total_pago)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Valor total pendente:</Text>
          <Text style={styles.infoValue}>{formatarMoeda(data.estatisticas.valor_total_pendente)}</Text>
        </View>
      </View>

      <Text style={styles.footer}>Sistema de Cobrança - Relatório gerado em {dataAtual}</Text>
    </Page>
  </Document>
)

// Componente de botões para exportação de PDF
export function PDFExportButtons({
  data,
  type,
}: {
  data: any
  type: "emprestimos-abertos" | "cobrancas-pendentes" | "pessoa"
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const dataAtual = formatarData(new Date())

  const getReportComponent = () => {
    switch (type) {
      case "emprestimos-abertos":
        return <EmprestimosAbertosReport data={data} dataAtual={dataAtual} />
      case "cobrancas-pendentes":
        return <CobrancasPendentesReport data={data} dataAtual={dataAtual} />
      case "pessoa":
        return <RelatorioPessoaReport data={data} dataAtual={dataAtual} />
      default:
        return null
    }
  }

  const getFileName = () => {
    switch (type) {
      case "emprestimos-abertos":
        return `emprestimos-abertos-${new Date().toISOString().split("T")[0]}.pdf`
      case "cobrancas-pendentes":
        return `cobrancas-pendentes-${new Date().toISOString().split("T")[0]}.pdf`
      case "pessoa":
        return `cliente-${data.pessoa.nome.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`
      default:
        return `relatorio-${new Date().toISOString().split("T")[0]}.pdf`
    }
  }

  return (
    <div className="flex gap-2">
      <PDFDownloadLink
        document={getReportComponent()}
        fileName={getFileName()}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        {({ loading }) =>
          loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar PDF
            </>
          )
        }
      </PDFDownloadLink>

      <Button variant="outline" onClick={() => setIsPreviewOpen(!isPreviewOpen)}>
        <Printer className="mr-2 h-4 w-4" />
        {isPreviewOpen ? "Fechar Visualização" : "Visualizar"}
      </Button>

      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Visualização do Relatório</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsPreviewOpen(false)}>
                Fechar
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <PDFViewer style={{ width: "100%", height: "100%" }}>{getReportComponent()}</PDFViewer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
