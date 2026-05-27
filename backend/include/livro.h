#ifndef LIVRO_H
#define LIVRO_H

#include <libpq-fe.h>

typedef struct Livro {
    int codigo;
    char titulo[100];
    char autor[100];
    int ano;
    int quantidade;
    struct Livro *prox;
} Livro;

Livro* cadastrarLivro(Livro *lista, PGconn *conn);
Livro* removerLivro(Livro *lista, PGconn *conn);
Livro* buscarLivro(Livro *lista, int codigo);
void buscarLivroBanco(PGconn *conn);
void listarLivrosBanco(PGconn *conn);

#endif