import type { cliente } from "./types";

const clientes: cliente[] = [
    { id: 1, nome: "Ana Costa", email: "ana@example.com" },
    { id: 2, nome: "Bruno Lima", email: "bruno@example.com" },
    { id: 3, nome: "Carla Souza", email: "carla@example.com" },
];

function cadCliente(novoCliente: cliente): void {
    if (!Number.isInteger(novoCliente.id) || novoCliente.id <= 0) {
        throw new Error("O ID do cliente deve ser um número inteiro maior que zero.");
    }
    if (!novoCliente.nome.trim() || !novoCliente.email.trim()) {
        throw new Error("Nome e e-mail do cliente são obrigatórios.");
    }
    if (!novoCliente.email.includes("@")) {
        throw new Error("Informe um e-mail válido.");
    }
    if (clientes.some((clienteAtual) => clienteAtual.id === novoCliente.id)) {
        throw new Error(`Já existe um cliente com o ID ${novoCliente.id}.`);
    }
    if (clientes.some((clienteAtual) => clienteAtual.email.toLowerCase() === novoCliente.email.trim().toLowerCase())) {
        throw new Error("Já existe um cliente com esse e-mail.");
    }

    clientes.push({
        ...novoCliente,
        nome: novoCliente.nome.trim(),
        email: novoCliente.email.trim(),
    });
}

function listarClientes(): cliente[] {
    return clientes.map((clienteAtual) => ({ ...clienteAtual }));
}

function buscarCliente(id: number): cliente | undefined {
    const clienteEncontrado = clientes.find((clienteAtual) => clienteAtual.id === id);
    return clienteEncontrado ? { ...clienteEncontrado } : undefined;
}

export { cadCliente, listarClientes, buscarCliente };
