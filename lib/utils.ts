import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatarData(data: string | Date): string {
  if (!data) return "-"

  try {
    const dataObj = typeof data === "string" ? parseISO(data) : data
    return format(dataObj, "dd/MM/yyyy", { locale: ptBR })
  } catch (error) {
    console.error("Erro ao formatar data:", error)
    return String(data)
  }
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor)
}

export function formatarTelefone(telefone: string): string {
  if (!telefone) return ""

  // Remove caracteres não numéricos
  const numeros = telefone.replace(/\D/g, "")

  if (numeros.length === 11) {
    // Celular: (99) 99999-9999
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  } else if (numeros.length === 10) {
    // Fixo: (99) 9999-9999
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
  }

  return telefone
}

export function formatarCPF(cpf: string): string {
  if (!cpf) return ""

  // Remove caracteres não numéricos
  const numeros = cpf.replace(/\D/g, "")

  if (numeros.length === 11) {
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  return cpf
}

export function formatarCNPJ(cnpj: string): string {
  if (!cnpj) return ""

  // Remove caracteres não numéricos
  const numeros = cnpj.replace(/\D/g, "")

  if (numeros.length === 14) {
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }

  return cnpj
}

export function formatarDocumento(tipo: string, documento: string): string {
  if (!documento) return ""

  if (tipo === "CPF") {
    return formatarCPF(documento)
  } else if (tipo === "CNPJ") {
    return formatarCNPJ(documento)
  }

  return documento
}

/**
 * Gera as cobranças para um empréstimo com base nos parâmetros fornecidos
 * @param valor Valor total do empréstimo
 * @param parcelas Número de parcelas
 * @param dataInicio Data de início do empréstimo
 * @param tipoCobranca Tipo de cobrança (MENSAL, SEMANAL, QUINZENAL)
 * @returns Array de objetos de cobrança
 */
export function gerarCobrancas(
  valor: number,
  parcelas: number,
  dataInicio: Date,
  tipoCobranca: "MENSAL" | "SEMANAL" | "QUINZENAL",
) {
  // Calcular o valor de cada parcela (arredondando para 2 casas decimais)
  const valorParcela = Number((valor / parcelas).toFixed(2))

  // Ajustar a última parcela para compensar eventuais diferenças por arredondamento
  const valorUltimaParcela = Number((valor - valorParcela * (parcelas - 1)).toFixed(2))

  const cobranças = []
  let dataVencimento = new Date(dataInicio)

  // Determinar o intervalo entre cobranças com base no tipo
  const getProximaData = (data: Date): Date => {
    const novaData = new Date(data)

    switch (tipoCobranca) {
      case "SEMANAL":
        novaData.setDate(novaData.getDate() + 7)
        break
      case "QUINZENAL":
        novaData.setDate(novaData.getDate() + 15)
        break
      case "MENSAL":
      default:
        novaData.setMonth(novaData.getMonth() + 1)
        break
    }

    return novaData
  }

  // Gerar as cobranças
  for (let i = 0; i < parcelas; i++) {
    // Para a primeira cobrança, usamos a data de início como base
    if (i > 0) {
      dataVencimento = getProximaData(dataVencimento)
    }

    cobranças.push({
      valor: i === parcelas - 1 ? valorUltimaParcela : valorParcela,
      data_vencimento: new Date(dataVencimento),
      status: "PENDENTE",
    })
  }

  return cobranças
}
