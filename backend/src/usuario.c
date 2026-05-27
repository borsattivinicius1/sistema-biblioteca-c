#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <libpq-fe.h>

#include "../include/usuario.h"

void cadastrarUsuario(PGconn *conn) {
    char nome[100];
    char email[100];
    char query[400];

    printf("Nome do usuario: ");
    scanf(" %[^\n]", nome);

    printf("Email do usuario: ");
    scanf(" %[^\n]", email);

    sprintf(query,
        "INSERT INTO usuarios (nome, email) VALUES ('%s', '%s');",
        nome, email
    );

    PGresult *res = PQexec(conn, query);

    if (PQresultStatus(res) != PGRES_COMMAND_OK) {
        printf("Erro ao cadastrar usuario: %s\n", PQerrorMessage(conn));
    } else {
        printf("Usuario cadastrado com sucesso!\n");
    }

    PQclear(res);
}

void listarUsuarios(PGconn *conn) {
    PGresult *res = PQexec(conn, "SELECT id, nome, email FROM usuarios ORDER BY id;");

    if (PQresultStatus(res) != PGRES_TUPLES_OK) {
        printf("Erro ao listar usuarios: %s\n", PQerrorMessage(conn));
        PQclear(res);
        return;
    }

    int linhas = PQntuples(res);

    if (linhas == 0) {
        printf("Nenhum usuario cadastrado.\n");
        PQclear(res);
        return;
    }

    for (int i = 0; i < linhas; i++) {
        printf("\n------------------\n");
        printf("ID: %s\n", PQgetvalue(res, i, 0));
        printf("Nome: %s\n", PQgetvalue(res, i, 1));
        printf("Email: %s\n", PQgetvalue(res, i, 2));
    }

    PQclear(res);
}