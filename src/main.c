#include <stdio.h>
#include <stdlib.h>

#include "../include/livro.h"
#include "../include/pilha.h"

int main() {

    Livro *lista = NULL;
    Operacao *historico = NULL;

    int opcao;
    int codigo;

    do {

        printf("\n===== SISTEMA BIBLIOTECA =====\n");
        printf("1 - Cadastrar livro\n");
        printf("2 - Remover livro\n");
        printf("3 - Buscar livro\n");
        printf("4 - Listar livros\n");
        printf("5 - Mostrar historico\n");
        printf("0 - Sair\n");

        printf("Opcao: ");
        scanf("%d", &opcao);

        switch(opcao) {

            case 1:
                lista = cadastrarLivro(lista);
                push(&historico, "Livro cadastrado");
                break;

            case 2:
                lista = removerLivro(lista);
                push(&historico, "Livro removido");
                break;

            case 3: {

                printf("Codigo do livro: ");
                scanf("%d", &codigo);

                Livro *encontrado = buscarLivro(lista, codigo);

                if(encontrado != NULL) {
                    printf("\nLivro encontrado!\n");
                    printf("Titulo: %s\n", encontrado->titulo);
                } else {
                    printf("Livro nao encontrado.\n");
                }

                break;
            }

            case 4:
                listarLivros(lista);
                break;

            case 5:
                mostrarHistorico(historico);
                break;

            case 0:
                printf("Encerrando sistema...\n");
                break;

            default:
                printf("Opcao invalida!\n");
        }

    } while(opcao != 0);

    return 0;
}