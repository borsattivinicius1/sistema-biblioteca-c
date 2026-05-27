#ifndef USUARIO_H
#define USUARIO_H

#include <libpq-fe.h>

void cadastrarUsuario(PGconn *conn);
void listarUsuarios(PGconn *conn);

#endif