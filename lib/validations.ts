import { z } from "zod"

// Validador de CPF
export function validarCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, "")

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false

  // Validação dos dígitos verificadores
  let soma = 0
  let resto

  for (let i = 1; i <= 9; i++) {
    soma = soma + Number.parseInt(cpf.substring(i - 1, i)) * (11 - i)
  }

  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== Number.parseInt(cpf.substring(9, 10))) return false

  soma = 0
  for (let i = 1; i <= 10; i++) {
    soma = soma + Number.parseInt(cpf.substring(i - 1, i)) * (12 - i)
  }

  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== Number.parseInt(cpf.substring(10, 11))) return false

  return true
}

// Esquema de validação para cadastro de usuário
export const cadastroUsuarioSchema = z
  .object({
    email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

// Esquema de validação para login
export const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
})

// Esquema de validação para cadastro de cliente
export const clienteSchema = z.object({
  nome_completo: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  tipo_documento: z.string().min(1, "Tipo de documento é obrigatório"),
  documento: z.string().refine(
    (val) => {
      // Se for CPF, valida com a função validarCPF
      if (val.length === 11 || val.length === 14) {
        return validarCPF(val)
      }
      // Para outros tipos de documento, apenas verifica se não está vazio
      return val.length > 0
    },
    {
      message: "Documento inválido",
    },
  ),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefone_principal: z.string().min(10, "Telefone inválido"),
  telefone_secundario: z.string().optional().or(z.literal("")),
  cep: z.string().length(8, "CEP deve ter 8 dígitos").regex(/^\d+$/, "CEP deve conter apenas números"),
  logradouro: z.string().min(3, "Logradouro deve ter pelo menos 3 caracteres"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional().or(z.literal("")),
  bairro: z.string().min(2, "Bairro deve ter pelo menos 2 caracteres"),
  cidade: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  estado: z.string().length(2, "Estado deve ter 2 caracteres"),
  observacoes: z.string().optional().or(z.literal("")),
  indicado_por: z.string().optional().or(z.literal("")),
})

// Esquema de validação para empréstimo
export const emprestimoSchema = z.object({
  valor: z.number().positive("Valor deve ser positivo"),
  data_inicio: z.string().min(1, "Data de início é obrigatória"),
  tipo_cobranca: z.enum(["DIARIA", "SEMANAL", "MENSAL"], {
    errorMap: () => ({ message: "Tipo de cobrança inválido" }),
  }),
  parcelas: z.number().int().positive("Número de parcelas deve ser positivo"),
  cliente_id: z.string().uuid("ID do cliente inválido"),
})

// Esquema de validação para cobrança
export const cobrancaSchema = z.object({
  valor: z.number().positive("Valor deve ser positivo"),
  data_vencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  data_pagamento: z.string().optional().or(z.literal("")),
  status: z.enum(["PENDENTE", "PAGO", "VENCIDO"], {
    errorMap: () => ({ message: "Status inválido" }),
  }),
  emprestimo_id: z.string().uuid("ID do empréstimo inválido"),
})
