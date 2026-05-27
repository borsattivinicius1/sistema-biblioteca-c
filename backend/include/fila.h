#ifndef FILA_H
#define FILA_H

typedef struct Reserva {
    int codigoLivro;
    char nomeUsuario[100];

    struct Reserva *prox;
} Reserva;

typedef struct {
    Reserva *inicio;
    Reserva *fim;
} FilaReserva;

void inicializarFila(FilaReserva *fila);

void adicionarReserva(
    FilaReserva *fila,
    int codigoLivro,
    char nomeUsuario[]
);

void mostrarReservas(FilaReserva *fila);

#endif