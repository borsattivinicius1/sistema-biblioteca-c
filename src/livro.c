#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "../include/livro.h"

Livro* cadastrarLivro(Livro *lista) {
    Livro *novo = (Livro*) malloc(sizeof(Livro));

    if(novo == NULL) {
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

    novo->prox = lista;

    printf("Livro cadastrado com sucesso!\n");

    return novo;
}

Livro* buscarLivro(Livro *lista, int codigo) {
    Livro *aux = lista;

    while(aux != NULL) {
        if(aux->codigo == codigo) {
            return aux;
        }

        aux = aux->prox;
    }

    return NULL;
}

void listarLivros(Livro *lista) {
    Livro *aux = lista;

    if(aux == NULL) {
        printf("Nenhum livro cadastrado.\n");
        return;
    }

    while(aux != NULL) {
        printf("\n------------------\n");
        printf("Codigo: %d\n", aux->codigo);
        printf("Titulo: %s\n", aux->titulo);
        printf("Autor: %s\n", aux->autor);
        printf("Ano: %d\n", aux->ano);
        printf("Quantidade: %d\n", aux->quantidade);

        aux = aux->prox;
    }
}

Livro* removerLivro(Livro *lista) {
    int codigo;

    printf("Codigo do livro para remover: ");
    scanf("%d", &codigo);

    Livro *aux = lista;
    Livro *anterior = NULL;

    while(aux != NULL && aux->codigo != codigo) {
        anterior = aux;
        aux = aux->prox;
    }

    if(aux == NULL) {
        printf("Livro nao encontrado.\n");
        return lista;
    }

    if(anterior == NULL) {
        lista = aux->prox;
    } else {
        anterior->prox = aux->prox;
    }

    free(aux);

    printf("Livro removido com sucesso!\n");

    return lista;
}