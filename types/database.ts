// Tipos para o banco de dados Supabase

export type TipoCobranca = "DIARIA" | "SEMANAL" | "MENSAL"
export type StatusEmprestimo = "EM_ANDAMENTO" | "QUITADO"
export type StatusCobranca = "PENDENTE" | "PAGO" | "VENCIDO"

export interface Pessoa {
  id: string
  nome: string
  cpf: string
  rg: string
  telefone: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  indicado_por: string | null
  created_at: string
  updated_at: string
}

export interface Cliente {
  id: string
  nome_completo: string
  tipo_documento: string
  documento: string
  email?: string
  telefone_principal: string
  telefone_secundario?: string
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  observacoes?: string
  indicado_por?: string
  created_at: string
  updated_at: string
}

export interface Emprestimo {
  id: string
  valor: number
  data_inicio: string
  tipo_cobranca: TipoCobranca
  parcelas: number
  status: StatusEmprestimo
  pessoa_id: string
  created_at: string
  updated_at: string
  pessoa?: Pessoa
  cobrancas?: Cobranca[]
}

export interface Cobranca {
  id: string
  valor: number
  data_vencimento: string
  data_pagamento: string | null
  status: StatusCobranca
  emprestimo_id: string
  created_at: string
  updated_at: string
  emprestimo?: Emprestimo
}
