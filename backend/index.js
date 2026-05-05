import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Configurações do Banco (Injetadas pelo K8s via Variáveis de Ambiente)
const pool = new Pool({
  host: process.env.DB_HOST || 'db-service',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

// Estratégia de Resiliência: Tenta conectar ao banco até conseguir
async function connectWithRetry() {
  console.log('🔄 Tentando conectar ao PostgreSQL...');
  try {
    const client = await pool.connect();
    console.log('✅ Conectado ao Banco de Dados!');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS funcionarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        cargo VARCHAR(100) NOT NULL,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    client.release();
  } catch (err) {
    console.error('❌ Falha na conexão. Tentando novamente em 5 segundos...', err.message);
    setTimeout(connectWithRetry, 5000);
  }
}

// Rota: Listar funcionários
app.get('/api/funcionarios', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM funcionarios ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

// Rota: Cadastrar funcionário
app.post('/api/funcionarios', async (req, res) => {
  const { nome, cargo } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO funcionarios (nome, cargo) VALUES ($1, $2) RETURNING *',
      [nome, cargo]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API escutando na porta ${PORT}`);
  connectWithRetry();
});
