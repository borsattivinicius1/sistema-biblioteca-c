

````md
# 📚 Sistema de Biblioteca em C

Sistema de biblioteca desenvolvido em **C**, utilizando **lista, pilha e fila**, com integração ao **PostgreSQL/Supabase**.  
Também possui uma interface web feita em React como complemento visual.

## Estrutura

```txt
sistema-biblioteca-c/
├── backend/   # Sistema principal em C
├── api/       # API Node.js
├── frontend/ # Interface web React
└── README.md
````

## Como executar o sistema em C

Entre na pasta do backend:

```bash
cd backend
```

Compile:

```bash
gcc src/*.c -Iinclude -I/usr/include/postgresql -lpq -o biblioteca
```

Execute:

```bash
./biblioteca
```

## Menu do sistema

```txt
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

## Estruturas de dados usadas

* **Lista:** usada para representar os livros em memória.
* **Pilha:** usada para armazenar o histórico de operações.
* **Fila:** usada para controlar reservas de livros.

## Banco de dados

O sistema utiliza PostgreSQL/Supabase para salvar os dados permanentemente.

Principais tabelas:

```txt
livros
usuarios
emprestimos
reservas
administradores
```

## Interface web

Para executar o frontend:

```bash
cd frontend
npm install
npm run dev
```

## API

Para executar a API:

```bash
cd api
npm install
node server.js
```

## Autor

Vinicius, Maria e Nicole 



