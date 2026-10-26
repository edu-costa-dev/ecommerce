"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adicionarItem = adicionarItem;
exports.alterarQuantidade = alterarQuantidade;
exports.removerItem = removerItem;
exports.listarItens = listarItens;
exports.calcularTotal = calcularTotal;
exports.limparCarrinho = limparCarrinho;
const clientes_1 = require("./clientes");
const produtos_1 = require("./produtos");
const carrinhos = new Map();
function obterCarrinho(clienteId) {
    if (!(0, clientes_1.buscarCliente)(clienteId)) {
        throw new Error(`Cliente com ID ${clienteId} não encontrado.`);
    }
    const carrinho = carrinhos.get(clienteId);
    if (!carrinho) {
        const novoCarrinho = [];
        carrinhos.set(clienteId, novoCarrinho);
        return novoCarrinho;
    }
    return carrinho;
}
function validarQuantidade(quantidade) {
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        throw new Error("A quantidade deve ser um número inteiro maior que zero.");
    }
}
function adicionarItem(clienteId, produtoId, quantidade) {
    validarQuantidade(quantidade);
    const produtoAtual = (0, produtos_1.buscarProduto)(produtoId);
    if (!produtoAtual) {
        throw new Error(`Produto com ID ${produtoId} não encontrado.`);
    }
    const carrinho = obterCarrinho(clienteId);
    const itemExistente = carrinho.find((item) => item.produtoId === produtoId);
    const novaQuantidade = (itemExistente?.quantidade ?? 0) + quantidade;
    if (novaQuantidade > produtoAtual.estoque) {
        throw new Error(`Estoque insuficiente para "${produtoAtual.nome}". Disponível: ${produtoAtual.estoque}.`);
    }
    if (itemExistente) {
        itemExistente.quantidade = novaQuantidade;
    }
    else {
        carrinho.push({ produtoId, quantidade });
    }
}
function alterarQuantidade(clienteId, produtoId, quantidade) {
    validarQuantidade(quantidade);
    const carrinho = obterCarrinho(clienteId);
    const item = carrinho.find((itemAtual) => itemAtual.produtoId === produtoId);
    if (!item) {
        throw new Error(`Produto com ID ${produtoId} não está no carrinho.`);
    }
    const produtoAtual = (0, produtos_1.buscarProduto)(produtoId);
    if (!produtoAtual) {
        throw new Error(`Produto com ID ${produtoId} não encontrado.`);
    }
    if (quantidade > produtoAtual.estoque) {
        throw new Error(`Estoque insuficiente para "${produtoAtual.nome}". Disponível: ${produtoAtual.estoque}.`);
    }
    item.quantidade = quantidade;
}
function removerItem(clienteId, produtoId) {
    const carrinho = obterCarrinho(clienteId);
    const indice = carrinho.findIndex((item) => item.produtoId === produtoId);
    if (indice === -1) {
        throw new Error(`Produto com ID ${produtoId} não está no carrinho.`);
    }
    carrinho.splice(indice, 1);
}
function listarItens(clienteId) {
    return obterCarrinho(clienteId).map((item) => {
        const produtoAtual = (0, produtos_1.buscarProduto)(item.produtoId);
        if (!produtoAtual) {
            throw new Error(`Produto com ID ${item.produtoId} não encontrado.`);
        }
        return {
            ...item,
            nomeProduto: produtoAtual.nome,
            precoUnitario: produtoAtual.preco,
            subtotal: produtoAtual.preco * item.quantidade,
        };
    });
}
function calcularTotal(clienteId) {
    return listarItens(clienteId).reduce((total, item) => total + item.subtotal, 0);
}
function limparCarrinho(clienteId) {
    obterCarrinho(clienteId).length = 0;
}
//# sourceMappingURL=carrinho.js.map