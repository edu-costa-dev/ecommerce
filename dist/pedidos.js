"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizarPedido = finalizarPedido;
exports.listarPedidos = listarPedidos;
exports.listarPedidosPorCliente = listarPedidosPorCliente;
const clientes_1 = require("./clientes");
const carrinho_1 = require("./carrinho");
const produtos_1 = require("./produtos");
const pedidos = [];
let proximoId = 1;
function finalizarPedido(clienteId) {
    if (!(0, clientes_1.buscarCliente)(clienteId)) {
        throw new Error(`Cliente com ID ${clienteId} não encontrado.`);
    }
    const itensCarrinho = (0, carrinho_1.listarItens)(clienteId);
    if (itensCarrinho.length === 0) {
        throw new Error("Não é possível finalizar um pedido sem itens.");
    }
    const itensPedido = itensCarrinho.map((item) => {
        const produtoAtual = (0, produtos_1.buscarProduto)(item.produtoId);
        if (!produtoAtual) {
            throw new Error(`Produto com ID ${item.produtoId} não encontrado.`);
        }
        if (item.quantidade > produtoAtual.estoque) {
            throw new Error(`Estoque insuficiente para "${produtoAtual.nome}".`);
        }
        return {
            produtoId: produtoAtual.id,
            nomeProduto: produtoAtual.nome,
            categoria: produtoAtual.categoria,
            quantidade: item.quantidade,
            precoUnitario: produtoAtual.preco,
            subtotal: produtoAtual.preco * item.quantidade,
        };
    });
    const novoPedido = {
        id: proximoId,
        clienteId,
        itens: itensPedido,
        total: (0, carrinho_1.calcularTotal)(clienteId),
        data: new Date().toISOString(),
    };
    itensPedido.forEach((item) => {
        (0, produtos_1.baixarEstoque)(item.produtoId, item.quantidade);
    });
    pedidos.push(novoPedido);
    proximoId += 1;
    (0, carrinho_1.limparCarrinho)(clienteId);
    return {
        ...novoPedido,
        itens: novoPedido.itens.map((item) => ({ ...item })),
    };
}
function listarPedidos() {
    return pedidos.map((pedidoAtual) => ({
        ...pedidoAtual,
        itens: pedidoAtual.itens.map((item) => ({ ...item })),
    }));
}
function listarPedidosPorCliente(clienteId) {
    return listarPedidos().filter((pedidoAtual) => pedidoAtual.clienteId === clienteId);
}
//# sourceMappingURL=pedidos.js.map