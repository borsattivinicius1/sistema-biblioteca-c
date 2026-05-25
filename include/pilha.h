#ifndef PILHA_H
#define PILHA_H

typedef struct Operacao {
    char descricao[200];

    struct Operacao *prox;
} Operacao;

// Funções
void push(Operacao **topo, char descricao[]);
void pop(Operacao **topo);
void mostrarHistorico(Operacao *topo);

#endif