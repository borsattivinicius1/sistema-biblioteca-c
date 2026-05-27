const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "biblioteca_db",
  password: "",
  port: 5432,
});

app.get("/livros", async (req, res) => {
  const result = await pool.query("SELECT * FROM livros ORDER BY codigo");
  res.json(result.rows);
});

app.post("/livros", async (req, res) => {
  const { codigo, titulo, autor, ano, quantidade } = req.body;

  await pool.query(
    "INSERT INTO livros (codigo, titulo, autor, ano, quantidade) VALUES ($1, $2, $3, $4, $5)",
    [codigo, titulo, autor, ano, quantidade]
  );

  res.json({ message: "Livro cadastrado com sucesso" });
});

app.delete("/livros/:codigo", async (req, res) => {
  await pool.query("DELETE FROM livros WHERE codigo = $1", [req.params.codigo]);
  res.json({ message: "Livro removido com sucesso" });
});

app.get("/usuarios", async (req, res) => {
  const result = await pool.query("SELECT * FROM usuarios ORDER BY id");
  res.json(result.rows);
});

app.post("/usuarios", async (req, res) => {
  const { nome, email } = req.body;

  await pool.query(
    "INSERT INTO usuarios (nome, email) VALUES ($1, $2)",
    [nome, email]
  );

  res.json({ message: "Usuário cadastrado com sucesso" });
});

app.post("/emprestimos", async (req, res) => {
  const { codigo_livro, id_usuario } = req.body;

  const livro = await pool.query(
    "SELECT * FROM livros WHERE codigo = $1",
    [codigo_livro]
  );

  if (livro.rows.length === 0) {
    return res.status(404).json({ message: "Livro não encontrado" });
  }

  if (livro.rows[0].quantidade <= 0) {
    return res.status(400).json({ message: "Livro sem estoque" });
  }

  await pool.query(
    "INSERT INTO emprestimos (codigo_livro, id_usuario) VALUES ($1, $2)",
    [codigo_livro, id_usuario]
  );

  await pool.query(
    "UPDATE livros SET quantidade = quantidade - 1 WHERE codigo = $1",
    [codigo_livro]
  );

  res.json({ message: "Empréstimo realizado com sucesso" });
});

app.get("/emprestimos", async (req, res) => {
  const result = await pool.query(`
    SELECT e.id, e.codigo_livro, l.titulo, u.nome AS usuario, e.status
    FROM emprestimos e
    JOIN livros l ON e.codigo_livro = l.codigo
    JOIN usuarios u ON e.id_usuario = u.id
    ORDER BY e.id DESC
  `);

  res.json(result.rows);
});

app.put("/emprestimos/:id/devolver", async (req, res) => {
  const emprestimo = await pool.query(
    "SELECT * FROM emprestimos WHERE id = $1 AND status = 'ATIVO'",
    [req.params.id]
  );

  if (emprestimo.rows.length === 0) {
    return res.status(404).json({ message: "Empréstimo não encontrado" });
  }

  const codigoLivro = emprestimo.rows[0].codigo_livro;

  await pool.query(
    "UPDATE emprestimos SET status = 'DEVOLVIDO', data_devolucao = CURRENT_TIMESTAMP WHERE id = $1",
    [req.params.id]
  );

  await pool.query(
    "UPDATE livros SET quantidade = quantidade + 1 WHERE codigo = $1",
    [codigoLivro]
  );

  res.json({ message: "Livro devolvido com sucesso" });
});

app.listen(3001, () => {
  console.log("API rodando em http://localhost:3001");
});