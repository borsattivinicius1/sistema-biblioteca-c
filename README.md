````md
# 📚 Sistema de Biblioteca em C

Projeto desenvolvido para a disciplina de Estrutura de Dados I utilizando linguagem C.

---

# 🎯 Objetivo do Projeto

Desenvolver um sistema de gerenciamento de biblioteca utilizando:

- 📌 Lista encadeada
- 📌 Pilha
- 📌 Fila
- 📌 Alocação dinâmica de memória
- 📌 Modularização em C
- 📌 Integração com banco de dados PostgreSQL

O sistema realiza controle de livros, usuários, empréstimos e reservas.

---

# ⚙️ Funcionalidades

## 📖 Livros
- Cadastro de livros
- Remoção de livros
- Busca de livros
- Listagem de livros
- Controle de quantidade disponível

## 👤 Usuários
- Cadastro de usuários
- Listagem de usuários

## 🔄 Empréstimos
- Empréstimo de livros
- Devolução de livros
- Atualização automática de estoque

## 🕒 Reservas
- Fila de reservas quando não há estoque disponível

## 📜 Histórico
- Registro de operações utilizando pilha

---

# 🧠 Estruturas de Dados Utilizadas

## 🔗 Lista Encadeada
Utilizada para gerenciamento dos livros em memória.

### Aplicações
- Inserção de livros
- Busca de livros
- Remoção de livros

---

## 📚 Pilha
Utilizada para registrar o histórico de operações do sistema.

### Exemplos
- Livro cadastrado
- Livro removido
- Livro emprestado
- Livro devolvido
- Usuário cadastrado

---

## 🚶 Fila
Utilizada para controlar reservas de livros indisponíveis.

### Funcionamento
Quando um livro está sem estoque:
1. O usuário entra na fila de espera
2. A reserva é armazenada em ordem de chegada

---

# 💻 Tecnologias Utilizadas

- Linguagem C
- PostgreSQL
- libpq
- Git
- GitHub
- GitHub Codespaces

---

# 📁 Estrutura do Projeto

```txt
sistema-biblioteca-c/
├── include/
│   ├── database.h
│   ├── emprestimo.h
│   ├── fila.h
│   ├── livro.h
│   ├── pilha.h
│   └── usuario.h
│
├── src/
│   ├── database.c
│   ├── emprestimo.c
│   ├── fila.c
│   ├── livro.c
│   ├── main.c
│   ├── pilha.c
│   └── usuario.c
│
├── data/
│
└── README.md
````

---

# 🗄️ Banco de Dados

## Banco utilizado

PostgreSQL

## 📋 Tabelas

### 📚 livros

Armazena os livros cadastrados.

### 👤 usuarios

Armazena os usuários do sistema.

### 🔄 emprestimos

Controla empréstimos e devoluções.

### 📜 historico

Armazena histórico de operações.

### 🕒 reservas

Controla reservas de livros sem estoque.

---

# 🧩 Modelo Relacional

## 📚 livros

| Campo      | Tipo    |
| ---------- | ------- |
| codigo     | INT     |
| titulo     | VARCHAR |
| autor      | VARCHAR |
| ano        | INT     |
| quantidade | INT     |

---

## 👤 usuarios

| Campo | Tipo    |
| ----- | ------- |
| id    | SERIAL  |
| nome  | VARCHAR |
| email | VARCHAR |

---

## 🔄 emprestimos

| Campo           | Tipo      |
| --------------- | --------- |
| id              | SERIAL    |
| codigo_livro    | INT       |
| id_usuario      | INT       |
| data_emprestimo | TIMESTAMP |
| data_devolucao  | TIMESTAMP |
| status          | VARCHAR   |

---

# ▶️ Compilação e Execução

## 🔨 Compilar o projeto

```bash
gcc src/*.c -Iinclude -I/usr/include/postgresql -lpq -o biblioteca
```

## 🚀 Executar o sistema

```bash
./biblioteca
```

---

# 🔄 Fluxo Básico do Sistema

1. 👤 Cadastrar usuários
2. 📚 Cadastrar livros
3. 🔄 Realizar empréstimos
4. 📥 Controlar devoluções
5. 🕒 Gerenciar reservas
6. 📜 Consultar histórico

---

# 🖥️ Exemplo de Menu

```txt
===== SISTEMA BIBLIOTECA =====

1 - Cadastrar livro
2 - Remover livro
3 - Buscar livro
4 - Listar livros
5 - Cadastrar usuario
6 - Listar usuarios
7 - Emprestar livro
8 - Devolver livro
9 - Mostrar historico
10 - Mostrar fila de reservas
0 - Sair
```

---

# 📚 Conceitos Aplicados

* Structs
* Ponteiros
* Alocação dinâmica
* Modularização
* CRUD
* Banco de dados relacional
* Integração C + PostgreSQL
* Manipulação de filas
* Manipulação de pilhas
* Manipulação de listas encadeadas

---

# 🚀 Possíveis Melhorias Futuras

* Interface web
* API REST
* Login de usuários
* Controle de multas
* Dashboard administrativo
* Integração frontend + backend
* Persistência completa do histórico
* Sistema de autenticação

---

# 👨‍💻 Autores

Projeto desenvolvido por:

* Vinicius

```
```
