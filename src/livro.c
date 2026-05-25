#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <libpq-fe.h>

#include "../include/livro.h"

Livro* cadastrarLivro(Livro *lista, PGconn *conn) {
    Livro *novo = malloc(sizeof(Livro));

    if (novo == NULL) {
        printf("Erro de memoria!\n");
        return lista;
    }

    printf("Codigo: ");
    scanf("%d", &novo->codigo);

    printf("Titulo: ");
    scanf(" %[^\n]", novo->titulo);

    printf("Autor: ");
    scanf(" %[^\n]", novo->autor);

    printf("Ano: ");
    scanf("%d", &novo->ano);

    printf("Quantidade: ");
    scanf("%d", &novo->quantidade);

    char query[500];

    sprintf(query,
        "INSERT INTO livros (codigo, titulo, autor, ano, quantidade) "
        "VALUES (%d, '%s', '%s', %d, %d);",
        novo->codigo,
        novo->titulo,
        novo->autor,
        novo->ano,
        novo->quantidade
    );

    PGresult *res = PQexec(conn, query);

    if (PQresultStatus(res) != PGRES_COMMAND_OK) {
        printf("Erro ao cadastrar no banco: %s\n", PQerrorMessage(conn));
        PQclear(res);
        free(novo);
        return lista;
    }

    PQclear(res);

    novo->prox = lista;
    printf("Livro cadastrado com sucesso!\n");

    return novo;
}

void listarLivrosBanco(PGconn *conn) {
    PGresult *res = PQexec(conn, "SELECT codigo, titulo, autor, ano, quantidade FROM livros ORDER BY codigo;");

    if (PQresultStatus(res) != PGRES_TUPLES_OK) {
        printf("Erro ao listar livros: %s\n", PQerrorMessage(conn));
        PQclear(res);
        return;
    }

    int linhas = PQntuples(res);

    if (linhas == 0) {
        printf("Nenhum livro cadastrado.\n");
        PQclear(res);
        return;
    }

    for (int i = 0; i < linhas; i++) {
        printf("\n------------------\n");
        printf("Codigo: %s\n", PQgetvalue(res, i, 0));
        printf("Titulo: %s\n", PQgetvalue(res, i, 1));
        printf("Autor: %s\n", PQgetvalue(res, i, 2));
        printf("Ano: %s\n", PQgetvalue(res, i, 3));
        printf("Quantidade: %s\n", PQgetvalue(res, i, 4));
    }

    PQclear(res);
}

void buscarLivroBanco(PGconn *conn) {
    int codigo;
    char query[200];

    printf("Codigo do livro: ");
    scanf("%d", &codigo);

    sprintf(query,
        "SELECT codigo, titulo, autor, ano, quantidade FROM livros WHERE codigo = %d;",
        codigo
    );

    PGresult *res = PQexec(conn, query);

    if (PQresultStatus(res) != PGRES_TUPLES_OK) {
        printf("Erro ao buscar livro: %s\n", PQerrorMessage(conn));
        PQclear(res);
        return;
    }

    if (PQntuples(res) == 0) {
        printf("Livro nao encontrado.\n");
        PQclear(res);
        return;
    }

    printf("\nLivro encontrado!\n");
    printf("Codigo: %s\n", PQgetvalue(res, 0, 0));
    printf("Titulo: %s\n", PQgetvalue(res, 0, 1));
    printf("Autor: %s\n", PQgetvalue(res, 0, 2));
    printf("Ano: %s\n", PQgetvalue(res, 0, 3));
    printf("Quantidade: %s\n", PQgetvalue(res, 0, 4));

    PQclear(res);
}

Livro* removerLivro(Livro *lista, PGconn *conn) {
    int codigo;
    char query[200];

    printf("Codigo do livro para remover: ");
    scanf("%d", &codigo);

    sprintf(query, "DELETE FROM livros WHERE codigo = %d;", codigo);

    PGresult *res = PQexec(conn, query);

    if (PQresultStatus(res) != PGRES_COMMAND_OK) {
        printf("Erro ao remover livro: %s\n", PQerrorMessage(conn));
        PQclear(res);
        return lista;
    }

    if (atoi(PQcmdTuples(res)) == 0) {
        printf("Livro nao encontrado.\n");
    } else {
        printf("Livro removido com sucesso!\n");
    }

    PQclear(res);
    return lista;
}

Livro* buscarLivro(Livro *lista, int codigo) {
    Livro *aux = lista;

    while (aux != NULL) {
        if (aux->codigo == codigo) {
            return aux;
        }

        aux = aux->prox;
    }

    return NULL;
}