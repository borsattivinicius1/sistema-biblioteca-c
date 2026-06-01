#include <stdio.h>
#include <stdlib.h>

#include "../include/database.h"

PGconn* conectarBanco() {

  PGconn *conn = PQconnectdb(
    "host=aws-1-us-west-2.pooler.supabase.com "
    "port=6543 "
    "dbname=postgres "
    "user=postgres.cnwkpajfoepdbhgqnhhu "
    "password=V!n1c1u$#Sup4B4s3_2026@DB "
    "sslmode=require"
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