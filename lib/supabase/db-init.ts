import { getSupabaseAdmin } from "./server"

export async function initializeDatabase() {
  const supabase = getSupabaseAdmin()

  try {
    // Criar tabela de usuários
    const { error: usuariosError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        perfil VARCHAR(50) NOT NULL,
        status BOOLEAN DEFAULT TRUE,
        ultimo_acesso TIMESTAMP,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    if (usuariosError) throw usuariosError

    // Criar tabela de clientes
    const { error: clientesError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        cpf_cnpj VARCHAR(20) UNIQUE NOT NULL,
        telefone VARCHAR(20),
        email VARCHAR(255),
        data_nascimento DATE,
        cep VARCHAR(10),
        logradouro VARCHAR(255),
        numero VARCHAR(20),
        complemento VARCHAR(100),
        bairro VARCHAR(100),
        cidade VARCHAR(100),
        estado VARCHAR(2),
        informacoes_adicionais TEXT,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    if (clientesError) throw clientesError

    // Criar tabela de empréstimos
    const { error: emprestimosError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS emprestimos (
        id SERIAL PRIMARY KEY,
        cliente_id INTEGER NOT NULL,
        valor DECIMAL(10, 2) NOT NULL,
        data_concessao DATE NOT NULL,
        taxa_juros DECIMAL(5, 2),
        numero_parcelas INTEGER NOT NULL,
        periodicidade VARCHAR(20) NOT NULL,
        dia_semana INTEGER,
        dia_mes INTEGER,
        primeiro_vencimento DATE NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Ativo',
        observacoes TEXT,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
      )
    `)

    if (emprestimosError) throw emprestimosError

    // Criar tabela de cobranças
    const { error: cobrancasError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS cobrancas (
        id SERIAL PRIMARY KEY,
        emprestimo_id INTEGER NOT NULL,
        numero_parcela INTEGER NOT NULL,
        valor DECIMAL(10, 2) NOT NULL,
        data_vencimento DATE NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Pendente',
        dias_atraso INTEGER DEFAULT 0,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_emprestimo FOREIGN KEY (emprestimo_id) REFERENCES emprestimos(id) ON DELETE CASCADE
      )
    `)

    if (cobrancasError) throw cobrancasError

    // Criar tabela de pagamentos
    const { error: pagamentosError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS pagamentos (
        id SERIAL PRIMARY KEY,
        cobranca_id INTEGER NOT NULL,
        valor_pago DECIMAL(10, 2) NOT NULL,
        data_pagamento DATE NOT NULL,
        forma_pagamento VARCHAR(50) NOT NULL,
        comprovante VARCHAR(255),
        observacoes TEXT,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_cobranca FOREIGN KEY (cobranca_id) REFERENCES cobrancas(id) ON DELETE CASCADE
      )
    `)

    if (pagamentosError) throw pagamentosError

    return { success: true }
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error)
    return { success: false, error }
  }
}
