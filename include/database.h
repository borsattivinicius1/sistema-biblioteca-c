#ifndef DATABASE_H
#define DATABASE_H

#include <libpq-fe.h>

PGconn* conectarBanco();
void fecharBanco(PGconn *conn);

#endif