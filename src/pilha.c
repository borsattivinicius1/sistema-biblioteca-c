
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "../include/pilha.h"

void push(Operacao **topo, char descricao[]) {
    Operacao *nova = (Operacao*) malloc(sizeof(Operacao));

    if(nova == NULL) {
        printf("Erro de memoria!\n");
        return;
    }

    strcpy(nova->descricao, descricao);

    nova->prox = *topo;
    *topo = nova;
}

void pop(Operacao **topo) {
    if(*topo == NULL) {
        printf("Pilha vazia.\n");
        return;
    }

    Operacao *temp = *topo;

    *topo = temp->prox;

    free(temp);
}

void mostrarHistorico(Operacao *topo) {
    Operacao *aux = topo;

    if(aux == NULL) {
        printf("Nenhuma operacao registrada.\n");
        return;
    }

    while(aux != NULL) {
        printf("- %s\n", aux->descricao);

        aux = aux->prox;
    }
}