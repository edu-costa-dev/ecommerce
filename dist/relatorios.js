"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarRelatorioVendas = gerarRelatorioVendas;
exports.gerarVendasPorCategoria = gerarVendasPorCategoria;
exports.gerarVendasPorProduto = gerarVendasPorProduto;
exports.gerarVendasPorProdutoId = gerarVendasPorProdutoId;
const pedidos_1 = require("./pedidos");
function gerarRelatorioVendas(clienteId) {
    const pedidos = clienteId === undefined
        ? (0, pedidos_1.listarPedidos)()
        : (0, pedidos_1.listarPedidosPorCliente)(clienteId);
    return pedidos.reduce((relatorio, pedidoAtual) => {
        relatorio.quantidadePedidos += 1;
        relatorio.totalVendido += pedidoAtual.total;
        relatorio.unidadesVendidas += pedidoAtual.itens.reduce((total, item) => total + item.quantidade, 0);
        return relatorio;
    }, { quantidadePedidos: 0, totalVendido: 0, unidadesVendidas: 0 });
}
function gerarVendasPorCategoria() {
    const vendas = new Map();
    for (const pedidoAtual of (0, pedidos_1.listarPedidos)()) {
        const categoriasNoPedido = new Set();
        for (const item of pedidoAtual.itens) {
            const venda = vendas.get(item.categoria) ?? {
                categoria: item.categoria,
                unidadesVendidas: 0,
                quantidadePedidos: 0,
                totalVendido: 0,
            };
            venda.unidadesVendidas += item.quantidade;
            venda.totalVendido += item.subtotal;
            vendas.set(item.categoria, venda);
            categoriasNoPedido.add(item.categoria);
        }
        for (const categoria of categoriasNoPedido) {
            vendas.get(categoria).quantidadePedidos += 1;
        }
    }
    return Array.from(vendas.values());
}
function gerarVendasPorProduto() {
    const vendas = new Map();
    const pedidosPorProduto = new Map();
    for (const pedidoAtual of (0, pedidos_1.listarPedidos)()) {
        for (const item of pedidoAtual.itens) {
            const venda = vendas.get(item.produtoId) ?? {
                produtoId: item.produtoId,
                nomeProduto: item.nomeProduto,
                categoria: item.categoria,
                unidadesVendidas: 0,
                quantidadePedidos: 0,
                totalVendido: 0,
            };
            venda.unidadesVendidas += item.quantidade;
            venda.totalVendido += item.subtotal;
            vendas.set(item.produtoId, venda);
            const pedidos = pedidosPorProduto.get(item.produtoId) ?? new Set();
            pedidos.add(pedidoAtual.id);
            pedidosPorProduto.set(item.produtoId, pedidos);
        }
    }
    return Array.from(vendas.values()).map((venda) => ({
        ...venda,
        quantidadePedidos: pedidosPorProduto.get(venda.produtoId)?.size ?? 0,
    }));
}
function gerarVendasPorProdutoId(produtoId) {
    const venda = gerarVendasPorProduto().find((item) => item.produtoId === produtoId);
    if (venda) {
        return venda;
    }
    return {
        produtoId,
        nomeProduto: "Sem vendas registradas",
        categoria: "-",
        unidadesVendidas: 0,
        quantidadePedidos: 0,
        totalVendido: 0,
    };
}
//# sourceMappingURL=relatorios.js.map