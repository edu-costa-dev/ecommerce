import promptSync from "prompt-sync";
import {
    adicionarItem,
    alterarQuantidade,
    calcularTotal,
    listarItens,
    removerItem,
} from "./carrinho";
import { buscarCliente, cadCliente, listarClientes } from "./clientes";
import { finalizarPedido, listarPedidos, listarPedidosPorCliente } from "./pedidos";
import {
    atualizarProduto,
    buscarProduto,
    buscarProdutosPorNome,
    cadProduto,
    filtrarProdutosPorCategoria,
    listarProdutos,
    removerProduto,
} from "./produtos";
import {
    gerarRelatorioVendas,
    gerarVendasPorCategoria,
    gerarVendasPorProduto,
    gerarVendasPorProdutoId,
} from "./relatorios";
import type { cliente, produto } from "./types";

const prompt = promptSync({ sigint: true });
const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function executarAcao(acao: () => void): void {
    try {
        acao();
    } catch (erro) {
        if (!(erro instanceof Error)) {
            throw erro;
        }
        console.log(`\nNão foi possível concluir: ${erro.message}`);
    }
}

function lerInteiro(pergunta: string): number {
    const valor = Number(prompt(pergunta));
    if (!Number.isInteger(valor)) {
        throw new Error("Digite um número inteiro válido.");
    }
    return valor;
}

function lerNumero(pergunta: string): number {
    const valorDigitado = prompt(pergunta).trim().replace(",", ".");
    const valor = Number(valorDigitado);
    if (!Number.isFinite(valor)) {
        throw new Error("Digite um valor numérico válido.");
    }
    return valor;
}

function lerTexto(pergunta: string): string {
    const valor = prompt(pergunta).trim();
    if (!valor) {
        throw new Error("O campo não pode ficar vazio.");
    }
    return valor;
}

function selecionarCliente(): cliente {
    const formaBusca = prompt("Localizar cliente por (1) ID ou (2) nome: ").trim();
    if (formaBusca === "1") {
        const id = lerInteiro("ID do cliente: ");
        const clienteEncontrado = buscarCliente(id);
        if (!clienteEncontrado) {
            throw new Error(`Cliente com ID ${id} não encontrado.`);
        }
        return clienteEncontrado;
    }
    if (formaBusca === "2") {
        const nome = lerTexto("Nome ou parte do nome: ").toLowerCase();
        const encontrados = listarClientes().filter((clienteAtual) =>
            clienteAtual.nome.toLowerCase().includes(nome),
        );
        if (encontrados.length === 0) {
            throw new Error("Nenhum cliente encontrado com esse nome.");
        }
        if (encontrados.length === 1) {
            return encontrados[0]!;
        }
        console.table(encontrados);
        const id = lerInteiro("Há mais de um resultado. Digite o ID desejado: ");
        const clienteEscolhido = encontrados.find((clienteAtual) => clienteAtual.id === id);
        if (!clienteEscolhido) {
            throw new Error("O ID informado não está entre os clientes encontrados.");
        }
        return clienteEscolhido;
    }
    throw new Error("Escolha 1 para ID ou 2 para nome.");
}

function imprimirCarrinho(clienteAtual: cliente): void {
    const itens = listarItens(clienteAtual.id);
    console.log(`\nCarrinho de ${clienteAtual.nome} (ID ${clienteAtual.id})`);
    if (itens.length === 0) {
        console.log("O carrinho está vazio.");
        return;
    }
    console.table(itens.map((item) => ({
        produtoId: item.produtoId,
        produto: item.nomeProduto,
        quantidade: item.quantidade,
        precoUnitario: moeda.format(item.precoUnitario),
        subtotal: moeda.format(item.subtotal),
    })));
    console.log(`Total da compra: ${moeda.format(calcularTotal(clienteAtual.id))}`);
}

function cadastrarCliente(): void {
    const nome = lerTexto("Nome completo: ");
    const email = lerTexto("E-mail: ");
    const proximoId = Math.max(0, ...listarClientes().map((clienteAtual) => clienteAtual.id)) + 1;
    cadCliente({ id: proximoId, nome, email });
    console.log(`Cliente cadastrado com o ID ${proximoId}.`);
}

function cadastrarProduto(): void {
    const nome = lerTexto("Nome do produto: ");
    const categoria = lerTexto("Categoria: ");
    const preco = lerNumero("Preço: R$ ");
    const estoque = lerInteiro("Quantidade inicial em estoque: ");
    const proximoId = Math.max(0, ...listarProdutos().map((produtoAtual) => produtoAtual.id)) + 1;
    cadProduto({ id: proximoId, nome, categoria, preco, estoque });
    console.log(`Produto cadastrado com o ID ${proximoId}.`);
}

function menuClientes(): void {
    let opcao = "";
    while (opcao !== "0") {
        console.log("\n=== Clientes ===");
        console.log("1 - Adicionar cliente");
        console.log("2 - Consultar todos os clientes");
        console.log("3 - Consultar cliente por ID");
        console.log("4 - Consultar cliente por nome");
        console.log("0 - Voltar");
        opcao = prompt("Escolha: ").trim();
        switch (opcao) {
            case "1":
                executarAcao(cadastrarCliente);
                break;
            case "2":
                console.table(listarClientes());
                break;
            case "3":
                executarAcao(() => {
                    const clienteAtual = buscarCliente(lerInteiro("ID do cliente: "));
                    if (!clienteAtual) {
                        throw new Error("Cliente não encontrado.");
                    }
                    console.table([clienteAtual]);
                });
                break;
            case "4":
                executarAcao(() => {
                    const nome = lerTexto("Nome ou parte do nome: ").toLowerCase();
                    const encontrados = listarClientes().filter((clienteAtual) =>
                        clienteAtual.nome.toLowerCase().includes(nome),
                    );
                    console.table(encontrados);
                    if (encontrados.length === 0) {
                        console.log("Nenhum cliente encontrado.");
                    }
                });
                break;
            case "0":
                break;
            default:
                console.log("Opção inválida.");
        }
    }
}

function menuProdutos(): void {
    let opcao = "";
    while (opcao !== "0") {
        console.log("\n=== Produtos ===");
        console.log("1 - Adicionar produto");
        console.log("2 - Consultar todos os produtos");
        console.log("3 - Consultar produto por ID");
        console.log("4 - Buscar produto pelo nome");
        console.log("5 - Filtrar por categoria");
        console.log("6 - Atualizar produto");
        console.log("7 - Remover produto");
        console.log("0 - Voltar");
        opcao = prompt("Escolha: ").trim();
        switch (opcao) {
            case "1":
                executarAcao(cadastrarProduto);
                break;
            case "2":
                console.table(listarProdutos());
                break;
            case "3":
                executarAcao(() => {
                    const produtoAtual = buscarProduto(lerInteiro("ID do produto: "));
                    if (!produtoAtual) {
                        throw new Error("Produto não encontrado.");
                    }
                    console.table([produtoAtual]);
                });
                break;
            case "4":
                executarAcao(() => {
                    const encontrados = buscarProdutosPorNome(lerTexto("Nome ou parte do nome: "));
                    console.table(encontrados);
                    if (encontrados.length === 0) {
                        console.log("Nenhum produto encontrado.");
                    }
                });
                break;
            case "5":
                executarAcao(() => {
                    const encontrados = filtrarProdutosPorCategoria(lerTexto("Categoria: "));
                    console.table(encontrados);
                    if (encontrados.length === 0) {
                        console.log("Nenhum produto encontrado nessa categoria.");
                    }
                });
                break;
            case "6":
                executarAcao(() => {
                    const id = lerInteiro("ID do produto: ");
                    const produtoAtual = buscarProduto(id);
                    if (!produtoAtual) {
                        throw new Error("Produto não encontrado.");
                    }
                    const nome = prompt(`Nome [${produtoAtual.nome}]: `).trim();
                    const categoria = prompt(`Categoria [${produtoAtual.categoria}]: `).trim();
                    const precoDigitado = prompt(`Preço [${produtoAtual.preco}]: `).trim();
                    const estoqueDigitado = prompt(`Estoque [${produtoAtual.estoque}]: `).trim();
                    const atualizacao: Partial<Omit<produto, "id">> = {};
                    if (nome) atualizacao.nome = nome;
                    if (categoria) atualizacao.categoria = categoria;
                    if (precoDigitado) atualizacao.preco = Number(precoDigitado.replace(",", "."));
                    if (estoqueDigitado) atualizacao.estoque = Number(estoqueDigitado);
                    atualizarProduto(id, atualizacao);
                    console.log("Produto atualizado.");
                });
                break;
            case "7":
                executarAcao(() => {
                    const id = lerInteiro("ID do produto a remover: ");
                    removerProduto(id);
                    console.log("Produto removido.");
                });
                break;
            case "0":
                break;
            default:
                console.log("Opção inválida.");
        }
    }
}

function executarComCarrinho(acao: (clienteAtual: cliente) => void): void {
    const clienteAtual = selecionarCliente();
    acao(clienteAtual);
}

function menuCarrinho(): void {
    let opcao = "";
    while (opcao !== "0") {
        console.log("\n=== Carrinho ===");
        console.log("1 - Criar/abrir carrinho por ID ou nome do cliente");
        console.log("2 - Consultar carrinho por ID ou nome do cliente");
        console.log("3 - Adicionar produto ao carrinho");
        console.log("4 - Alterar quantidade de um produto");
        console.log("5 - Excluir produto do carrinho");
        console.log("6 - Mostrar subtotal de cada produto e total da compra");
        console.log("0 - Voltar");
        opcao = prompt("Escolha: ").trim();
        switch (opcao) {
            case "1":
                executarAcao(() => executarComCarrinho((clienteAtual) => {
                    listarItens(clienteAtual.id);
                    console.log(`Carrinho criado/aberto para ${clienteAtual.nome}.`);
                }));
                break;
            case "2":
            case "6":
                executarAcao(() => executarComCarrinho(imprimirCarrinho));
                break;
            case "3":
                executarAcao(() => executarComCarrinho((clienteAtual) => {
                    const produtoId = lerInteiro("ID do produto: ");
                    const quantidade = lerInteiro("Quantidade a adicionar: ");
                    adicionarItem(clienteAtual.id, produtoId, quantidade);
                    console.log("Produto adicionado ao carrinho.");
                }));
                break;
            case "4":
                executarAcao(() => executarComCarrinho((clienteAtual) => {
                    const produtoId = lerInteiro("ID do produto: ");
                    const quantidade = lerInteiro("Nova quantidade: ");
                    alterarQuantidade(clienteAtual.id, produtoId, quantidade);
                    console.log("Quantidade atualizada.");
                }));
                break;
            case "5":
                executarAcao(() => executarComCarrinho((clienteAtual) => {
                    const produtoId = lerInteiro("ID do produto a excluir: ");
                    removerItem(clienteAtual.id, produtoId);
                    console.log("Produto removido do carrinho.");
                }));
                break;
            case "0":
                break;
            default:
                console.log("Opção inválida.");
        }
    }
}

function menuPedidos(): void {
    let opcao = "";
    while (opcao !== "0") {
        console.log("\n=== Pedidos ===");
        console.log("1 - Revisar carrinho e finalizar pedido");
        console.log("2 - Consultar todos os pedidos");
        console.log("3 - Consultar pedidos de um cliente");
        console.log("0 - Voltar");
        opcao = prompt("Escolha: ").trim();
        switch (opcao) {
            case "1":
                executarAcao(() => executarComCarrinho((clienteAtual) => {
                    imprimirCarrinho(clienteAtual);
                    if (listarItens(clienteAtual.id).length === 0) {
                        throw new Error("Adicione produtos ao carrinho antes de finalizar.");
                    }
                    const confirmar = prompt("Deseja finalizar a compra? (s/n): ").trim().toLowerCase();
                    if (confirmar !== "s") {
                        console.log("Finalização cancelada; o carrinho foi mantido.");
                        return;
                    }
                    const pedido = finalizarPedido(clienteAtual.id);
                    console.log(`Pedido #${pedido.id} finalizado. Total: ${moeda.format(pedido.total)}`);
                }));
                break;
            case "2":
                console.table(listarPedidos().map((pedido) => ({
                    id: pedido.id,
                    clienteId: pedido.clienteId,
                    data: pedido.data,
                    total: moeda.format(pedido.total),
                })));
                break;
            case "3":
                executarAcao(() => {
                    const clienteAtual = selecionarCliente();
                    const pedidos = listarPedidosPorCliente(clienteAtual.id);
                    console.table(pedidos.map((pedido) => ({
                        id: pedido.id,
                        data: pedido.data,
                        total: moeda.format(pedido.total),
                    })));
                    if (pedidos.length === 0) {
                        console.log("Esse cliente ainda não tem pedidos.");
                    }
                });
                break;
            case "0":
                break;
            default:
                console.log("Opção inválida.");
        }
    }
}

function menuEstoque(): void {
    let opcao = "";
    while (opcao !== "0") {
        console.log("\n=== Estoque ===");
        console.log("1 - Consultar estoque atual");
        console.log("2 - Atualizar estoque de um produto");
        console.log("0 - Voltar");
        opcao = prompt("Escolha: ").trim();
        switch (opcao) {
            case "1":
                console.table(listarProdutos().map((produtoAtual) => ({
                    id: produtoAtual.id,
                    nome: produtoAtual.nome,
                    categoria: produtoAtual.categoria,
                    estoque: produtoAtual.estoque,
                })));
                break;
            case "2":
                executarAcao(() => {
                    const id = lerInteiro("ID do produto: ");
                    const produtoAtual = buscarProduto(id);
                    if (!produtoAtual) {
                        throw new Error("Produto não encontrado.");
                    }
                    const novoEstoque = lerInteiro(`Novo estoque para ${produtoAtual.nome}: `);
                    atualizarProduto(id, { estoque: novoEstoque });
                    console.log("Estoque atualizado.");
                });
                break;
            case "0":
                break;
            default:
                console.log("Opção inválida.");
        }
    }
}

function menuRelatorios(): void {
    let opcao = "";
    while (opcao !== "0") {
        console.log("\n=== Relatórios de vendas ===");
        console.log("1 - Resumo geral das vendas");
        console.log("2 - Vendas por categoria");
        console.log("3 - Vendas por produto (ID)");
        console.log("0 - Voltar");
        opcao = prompt("Escolha: ").trim();
        switch (opcao) {
            case "1":
                console.table([gerarRelatorioVendas()]);
                break;
            case "2":
                console.table(gerarVendasPorCategoria());
                break;
            case "3":
                executarAcao(() => {
                    const vendas = gerarVendasPorProduto();
                    if (vendas.length > 0) {
                        console.table(vendas);
                    } else {
                        console.log("Ainda não há vendas registradas.");
                    }
                    const id = lerInteiro("Consultar um produto específico por ID? Digite o ID ou 0 para não: ");
                    if (id > 0) {
                        console.table([gerarVendasPorProdutoId(id)]);
                    }
                });
                break;
            case "0":
                break;
            default:
                console.log("Opção inválida.");
        }
    }
}

function menuPrincipal(): void {
    let opcao = "";
    while (opcao !== "0") {
        console.log("\n===== SISTEMA DE E-COMMERCE =====");
        console.log("1 - Clientes");
        console.log("2 - Produtos");
        console.log("3 - Pedidos");
        console.log("4 - Carrinho");
        console.log("5 - Estoque");
        console.log("6 - Relatório de vendas");
        console.log("0 - Sair");
        opcao = prompt("Escolha uma opção: ").trim();
        switch (opcao) {
            case "1":
                menuClientes();
                break;
            case "2":
                menuProdutos();
                break;
            case "3":
                menuPedidos();
                break;
            case "4":
                menuCarrinho();
                break;
            case "5":
                menuEstoque();
                break;
            case "6":
                menuRelatorios();
                break;
            case "0":
                console.log("Até logo!");
                break;
            default:
                console.log("Opção inválida.");
        }
    }
}

menuPrincipal();
