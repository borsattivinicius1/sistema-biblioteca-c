#include <stdio.h>
#include <stdlib.h>

#include "../include/livro.h"
#include "../include/pilha.h"
#include "../include/database.h"
#include "../include/usuario.h"
#include "../include/emprestimo.h"
#include "../include/fila.h"

int main() {
    PGconn *conn = conectarBanco();

    if (conn == NULL) {
        return 1;
    }

    Livro *lista = NULL;
    Operacao *historico = NULL;

    FilaReserva fila;
    inicializarFila(&fila);

    int opcao;

    do {
        printf("\n===== SISTEMA BIBLIOTECA =====\n");
        printf("1 - Cadastrar livro\n");
        printf("2 - Remover livro\n");
        printf("3 - Buscar livro\n");
        printf("4 - Listar livros\n");
        printf("5 - Cadastrar usuario\n");
        printf("6 - Listar usuarios\n");
        printf("7 - Emprestar livro\n");
        printf("8 - Devolver livro\n");
        printf("9 - Mostrar historico\n");
        printf("10 - Mostrar fila de reservas\n");
        printf("0 - Sair\n");

        printf("Opcao: ");
        scanf("%d", &opcao);

        switch (opcao) {
            case 1:
                lista = cadastrarLivro(lista, conn);
                push(&historico, "Livro cadastrado");
                break;

            case 2:
                lista = removerLivro(lista, conn);
                push(&historico, "Livro removido");
                break;

            case 3:
                buscarLivroBanco(conn);
                break;

            case 4:
                listarLivrosBanco(conn);
                break;

            case 5:
                cadastrarUsuario(conn);
                push(&historico, "Usuario cadastrado");
                break;

            case 6:
                listarUsuarios(conn);
                break;

            case 7:
                emprestarLivro(conn, &fila);
                push(&historico, "Livro emprestado");
                break;

            case 8:
                devolverLivro(conn);
                push(&historico, "Livro devolvido");
                break;

            case 9:
                mostrarHistorico(historico);
                break;

            case 10:
                mostrarReservas(&fila);
                break;

            case 0:
                printf("Encerrando sistema...\n");
                break;

            default:
                printf("Opcao invalida!\n");
        }

    } while (opcao != 0);

    fecharBanco(conn);

    return 0;
}