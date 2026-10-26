export type cliente = {
    id: number;
    nome: string;
    email: string;
};

export type produto = {
    id: number;
    nome: string;
    categoria: string;
    preco: number;
    estoque: number;
};

export type itemCarrinho = {
    produtoId: number;
    quantidade: number;
};

export type itemPedido = {
    produtoId: number;
    nomeProduto: string;
    categoria: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
};

export type pedido = {
    id: number;
    clienteId: number;
    itens: itemPedido[];
    total: number;
    data: string;
};
