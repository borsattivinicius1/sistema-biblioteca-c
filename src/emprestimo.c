#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <libpq-fe.h>

#include "../include/emprestimo.h"
#include "../include/fila.h"

void emprestarLivro(
    PGconn *conn,
    FilaReserva *fila)
{

    int codigoLivro;
    int idUsuario;

    char query[500];

    printf("Codigo do livro: ");
    scanf("%d", &codigoLivro);

    printf("ID do usuario: ");
    scanf("%d", &idUsuario);

    sprintf(query,
            "SELECT quantidade FROM livros WHERE codigo = %d;",
            codigoLivro);

    PGresult *res = PQexec(conn, query);

    if (PQntuples(res) == 0)
    {
        printf("Livro nao encontrado.\n");
        PQclear(res);
        return;
    }

    int quantidade = atoi(PQgetvalue(res, 0, 0));

    PQclear(res);

    if (quantidade <= 0)
    {

        char nomeUsuario[100];

        printf("Livro sem estoque.\n");

        printf("Nome para reserva: ");
        scanf(" %[^\n]", nomeUsuario);

        adicionarReserva(
            fila,
            codigoLivro,
            nomeUsuario);

        return;
    }

    sprintf(query,
            "INSERT INTO emprestimos "
            "(codigo_livro, id_usuario) "
            "VALUES (%d, %d);",
            codigoLivro,
            idUsuario);

    res = PQexec(conn, query);

    if (PQresultStatus(res) != PGRES_COMMAND_OK)
    {
        printf("Erro ao registrar emprestimo.\n");
        PQclear(res);
        return;
    }

    PQclear(res);

    sprintf(query,
            "UPDATE livros "
            "SET quantidade = quantidade - 1 "
            "WHERE codigo = %d;",
            codigoLivro);

    res = PQexec(conn, query);

    PQclear(res);

    printf("Emprestimo realizado com sucesso!\n");
}

void devolverLivro(PGconn *conn)
{

    int idEmprestimo;

    char query[500];

    printf("ID do emprestimo: ");
    scanf("%d", &idEmprestimo);

    sprintf(query,
            "SELECT codigo_livro "
            "FROM emprestimos "
            "WHERE id = %d AND status = 'ATIVO';",
            idEmprestimo);

    PGresult *res = PQexec(conn, query);

    if (PQntuples(res) == 0)
    {
        printf("Emprestimo nao encontrado.\n");
        PQclear(res);
        return;
    }

    int codigoLivro = atoi(PQgetvalue(res, 0, 0));

    PQclear(res);

    sprintf(query,
            "UPDATE emprestimos "
            "SET status = 'DEVOLVIDO', "
            "data_devolucao = CURRENT_TIMESTAMP "
            "WHERE id = %d;",
            idEmprestimo);

    res = PQexec(conn, query);

    PQclear(res);

    sprintf(query,
            "UPDATE livros "
            "SET quantidade = quantidade + 1 "
            "WHERE codigo = %d;",
            codigoLivro);

    res = PQexec(conn, query);

    PQclear(res);

    printf("Livro devolvido com sucesso!\n");
}