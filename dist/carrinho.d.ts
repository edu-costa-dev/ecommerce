import type { itemCarrinho } from "./types";
type itemCarrinhoDetalhado = itemCarrinho & {
    nomeProduto: string;
    precoUnitario: number;
    subtotal: number;
};
declare function adicionarItem(clienteId: number, produtoId: number, quantidade: number): void;
declare function alterarQuantidade(clienteId: number, produtoId: number, quantidade: number): void;
declare function removerItem(clienteId: number, produtoId: number): void;
declare function listarItens(clienteId: number): itemCarrinhoDetalhado[];
declare function calcularTotal(clienteId: number): number;
declare function limparCarrinho(clienteId: number): void;
export { adicionarItem, alterarQuantidade, removerItem, listarItens, calcularTotal, limparCarrinho, };
export type { itemCarrinhoDetalhado };
//# sourceMappingURL=carrinho.d.ts.map