// /backend/config/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',        // Altere para o seu usuário MySQL
  password: '748512g#G',   // Altere para a sua senha MySQL
  database: 'aalevar_sql',  // Altere para o nome do seu banco de dados
  waitForConnections: true,
  connectionLimit: 10, // Limite de conexões simultâneas
  queueLimit: 0
});

export default pool;
