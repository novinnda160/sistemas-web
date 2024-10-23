import knex from 'knex';
import dotenv from 'dotenv'; // Adicionado import do dotenv

// Carregar as variáveis de ambiente do .env
dotenv.config();

// Verificar se as variáveis de ambiente foram carregadas corretamente
console.log("HOST:", process.env.DB_HOST);
console.log("USER:", process.env.DB_USER);
console.log("DATABASE:", process.env.DB_NAME);

// Configurar o Knex com as variáveis de ambiente
const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

// Função para consultar uma tabela e exibir os resultados
const fetchTableData = async (tableName) => {
  try {
    const results = await db.select('*').from(tableName);
    console.log(`Resultados da tabela ${tableName}:`, results);
  } catch (err) {
    console.error(`Erro na consulta da tabela ${tableName}:`, err);
  }
};

// Consultar todas as tabelas
fetchTableData('usuarios');
fetchTableData('regiao');
fetchTableData('bairros');
fetchTableData('pedidos');
fetchTableData('clientes');

// Fechar a conexão ao finalizar as consultas
process.on('SIGINT', async () => {
  await db.destroy();
  console.log('Conexão com o banco de dados encerrada.');
  process.exit(0);
});

// Criar uma nova fatura
export const createInvoice = (req, res) => {
  const { clientId, deliveryValue } = req.body;
  const sql = 'INSERT INTO invoices (clientId, value, status) VALUES (?, ?, "Pendente")';
  db.query(sql, [clientId, deliveryValue], (err, result) => {
      if (err) {
          return res.status(500).send('Erro ao criar fatura');
      }
      res.send({ message: 'Fatura criada com sucesso!', id: result.insertId });
  });
};

// Listar todas as faturas
export const getInvoices = (req, res) => {
  const sql = 'SELECT * FROM invoices';
  db.query(sql, (err, results) => {
      if (err) {
          return res.status(500).send('Erro ao listar faturas');
      }
      res.json(results);
  });
};

// Deletar uma fatura
export const deleteInvoice = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM invoices WHERE id = ?';
  db.query(sql, [id], (err, result) => {
      if (err) {
          return res.status(500).send('Erro ao deletar fatura');
      }
      res.send({ message: 'Fatura deletada com sucesso!' });
  });
};

// Exportar a instância do Knex
export default db;
