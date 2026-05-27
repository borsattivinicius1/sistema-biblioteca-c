#ifndef EMPRESTIMO_H
#define EMPRESTIMO_H

#include <libpq-fe.h>
#include "fila.h"

void emprestarLivro(
    PGconn *conn,
    FilaReserva *fila
);

void devolverLivro(PGconn *conn);

#endif