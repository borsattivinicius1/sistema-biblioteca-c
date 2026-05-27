#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "../include/fila.h"

void inicializarFila(FilaReserva *fila) {
    fila->inicio = NULL;
    fila->fim = NULL;
}

void adicionarReserva(
    FilaReserva *fila,
    int codigoLivro,
    char nomeUsuario[]
) {

    Reserva *nova = malloc(sizeof(Reserva));

    if (nova == NULL) {
        printf("Erro de memoria.\n");
        return;
    }

    nova->codigoLivro = codigoLivro;

    strcpy(nova->nomeUsuario, nomeUsuario);

    nova->prox = NULL;

    if (fila->fim == NULL) {
        fila->inicio = nova;
        fila->fim = nova;
    } else {
        fila->fim->prox = nova;
        fila->fim = nova;
    }

    printf("Reserva adicionada na fila.\n");
}

void mostrarReservas(FilaReserva *fila) {

    Reserva *aux = fila->inicio;

    if (aux == NULL) {
        printf("Fila vazia.\n");
        return;
    }

    while (aux != NULL) {

        printf("\n------------------\n");
        printf("Codigo Livro: %d\n", aux->codigoLivro);
        printf("Usuario: %s\n", aux->nomeUsuario);

        aux = aux->prox;
    }
}