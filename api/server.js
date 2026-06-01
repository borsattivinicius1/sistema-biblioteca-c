const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "biblioteca_secreta";
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ubiquitous-spoon-r4q44q5v4w56fpq94-5173.app.github.dev",
    "https://sistema-biblioteca-c-7djs.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
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
  try {
    const { codigo } = req.params;

    await pool.query("DELETE FROM emprestimos WHERE codigo_livro = $1", [codigo]);
    await pool.query("DELETE FROM reservas WHERE codigo_livro = $1", [codigo]);

    const result = await pool.query(
      "DELETE FROM livros WHERE codigo = $1",
      [codigo]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Livro não encontrado" });
    }

    res.json({ message: "Livro removido com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao remover livro" });
  }
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



app.post("/admin/cadastrar", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query(
      "INSERT INTO administradores (nome, email, senha_hash) VALUES ($1, $2, $3)",
      [nome, email, senhaHash]
    );

    res.json({ message: "Administrador cadastrado com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao cadastrar administrador" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const result = await pool.query(
      "SELECT * FROM administradores WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "E-mail ou senha inválidos" });
    }

    const admin = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, admin.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({ message: "E-mail ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: admin.id, nome: admin.nome, email: admin.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login realizado com sucesso",
      token,
      usuario: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao realizar login" });
  }
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;