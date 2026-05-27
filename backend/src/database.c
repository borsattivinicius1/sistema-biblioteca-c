#include <stdio.h>
#include <stdlib.h>

#include "../include/database.h"

PGconn* conectarBanco() {

    PGconn *conn = PQconnectdb(
        "dbname=biblioteca_db "
        "user=postgres"
    );

    if(PQstatus(conn) != CONNECTION_OK) {
        printf("Erro na conexao: %s\n", PQerrorMessage(conn));
        return NULL;
    }

    printf("Banco conectado com sucesso!\n");

    return conn;
}

void fecharBanco(PGconn *conn) {
    PQfinish(conn);
}