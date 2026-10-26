import type { produto } from "./types";
declare function cadProduto(novoProduto: produto): void;
declare function listarProdutos(): produto[];
declare function buscarProduto(id: number): produto | undefined;
declare function buscarProdutosPorNome(nome: string): produto[];
declare function filtrarProdutosPorCategoria(categoria: string): produto[];
declare function atualizarProduto(id: number, atualizacao: Partial<Omit<produto, "id">>): void;
declare function removerProduto(id: number): void;
declare function baixarEstoque(id: number, quantidade: number): void;
export { cadProduto, listarProdutos, buscarProduto, buscarProdutosPorNome, filtrarProdutosPorCategoria, atualizarProduto, removerProduto, baixarEstoque, };
//# sourceMappingURL=produtos.d.ts.map