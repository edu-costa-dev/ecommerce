import type { pedido } from "./types";
declare function finalizarPedido(clienteId: number): pedido;
declare function listarPedidos(): pedido[];
declare function listarPedidosPorCliente(clienteId: number): pedido[];
export { finalizarPedido, listarPedidos, listarPedidosPorCliente };
//# sourceMappingURL=pedidos.d.ts.map