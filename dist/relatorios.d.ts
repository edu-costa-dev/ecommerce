type relatorioVendas = {
    quantidadePedidos: number;
    totalVendido: number;
    unidadesVendidas: number;
};
type vendaPorProduto = {
    produtoId: number;
    nomeProduto: string;
    categoria: string;
    unidadesVendidas: number;
    quantidadePedidos: number;
    totalVendido: number;
};
type vendaPorCategoria = {
    categoria: string;
    unidadesVendidas: number;
    quantidadePedidos: number;
    totalVendido: number;
};
declare function gerarRelatorioVendas(clienteId?: number): relatorioVendas;
declare function gerarVendasPorCategoria(): vendaPorCategoria[];
declare function gerarVendasPorProduto(): vendaPorProduto[];
declare function gerarVendasPorProdutoId(produtoId: number): vendaPorProduto;
export { gerarRelatorioVendas, gerarVendasPorCategoria, gerarVendasPorProduto, gerarVendasPorProdutoId };
export type { relatorioVendas, vendaPorProduto };
//# sourceMappingURL=relatorios.d.ts.map