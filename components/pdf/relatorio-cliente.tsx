import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import { formatarData, formatarMoeda, formatarDocumento } from "@/lib/utils"

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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    paddingBottom: 10,
  },
  logo: {
    width: 120,
    height: 40,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  col50: {
    width: "50%",
    paddingRight: 10,
  },
  col33: {
    width: "33.33%",
    paddingRight: 10,
  },
  statusBadge: {
    padding: 3,
    borderRadius: 3,
    fontSize: 9,
    textAlign: "center",
    width: 60,
  },
  statusPendente: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  statusPago: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
  },
  statusVencido: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
  },
})

// Componente para relatório de cliente
export const RelatorioCliente = ({ data, dataAtual }: { data: any; dataAtual: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Relatório de Cliente</Text>
          <Text style={styles.subtitle}>Data de geração: {dataAtual}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={{ fontSize: 12 }}>Sistema de Cobrança</Text>
          <Text style={{ fontSize: 10, color: "#666" }}>Relatório Detalhado</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados do Cliente</Text>
        <View style={styles.grid}>
          <View style={styles.col50}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome:</Text>
              <Text style={styles.infoValue}>{data.cliente.nome_completo}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Documento:</Text>
              <Text style={styles.infoValue}>
                {formatarDocumento(data.cliente.tipo_documento, data.cliente.documento)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{data.cliente.email || "-"}</Text>
            </View>
          </View>
          <View style={styles.col50}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Telefone:</Text>
              <Text style={styles.infoValue}>{data.cliente.telefone_principal}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Endereço:</Text>
              <Text style={styles.infoValue}>
                {data.cliente.logradouro}, {data.cliente.numero}
                {data.cliente.complemento ? `, ${data.cliente.complemento}` : ""}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cidade/UF:</Text>
              <Text style={styles.infoValue}>
                {data.cliente.cidade}/{data.cliente.estado}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
        <View style={styles.grid}>
          <View style={styles.col33}>
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
          </View>
          <View style={styles.col33}>
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
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Empréstimos</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>ID</Text>
            <Text style={styles.tableCell}>Valor</Text>
            <Text style={styles.tableCell}>Data Início</Text>
            <Text style={styles.tableCell}>Tipo</Text>
            <Text style={styles.tableCell}>Parcelas</Text>
            <Text style={styles.tableCellLast}>Status</Text>
          </View>

          {data.emprestimos.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={{ ...styles.tableCell, textAlign: "center", padding: 10 }} colSpan={6}>
                Nenhum empréstimo encontrado.
              </Text>
            </View>
          ) : (
            data.emprestimos.map((emprestimo: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{emprestimo.id.substring(0, 8)}</Text>
                <Text style={styles.tableCell}>{formatarMoeda(Number(emprestimo.valor))}</Text>
                <Text style={styles.tableCell}>{formatarData(emprestimo.data_inicio)}</Text>
                <Text style={styles.tableCell}>{emprestimo.tipo_cobranca}</Text>
                <Text style={styles.tableCell}>
                  {emprestimo.parcelas_pagas} / {emprestimo.parcelas}
                </Text>
                <Text style={styles.tableCellLast}>
                  <Text
                    style={{
                      ...styles.statusBadge,
                      ...(emprestimo.status === "QUITADO" ? styles.statusPago : styles.statusPendente),
                    }}
                  >
                    {emprestimo.status === "QUITADO" ? "Quitado" : "Em andamento"}
                  </Text>
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

      <Text style={styles.footer}>Sistema de Cobrança - Relatório gerado em {dataAtual}</Text>
    </Page>
  </Document>
)
