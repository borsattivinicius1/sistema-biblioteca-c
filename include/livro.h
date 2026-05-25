#ifndef LIVRO_H
#define LIVRO_H

typedef struct Livro {
    int codigo;
    char titulo[100];
    char autor[100];
    int ano;
    int quantidade;

    struct Livro *prox;
} Livro;

// Funções
Livro* cadastrarLivro(Livro *lista);
Livro* removerLivro(Livro *lista);
Livro* buscarLivro(Livro *lista, int codigo);
void listarLivros(Livro *lista);

#endif