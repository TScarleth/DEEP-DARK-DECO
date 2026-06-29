/** Item almacenado en el carrito de compras. */
export interface CartItem {
  nombre: string;
  precio: string;
  imagen: string;
  categoria: string;
  cantidad: number;
}

/** Compra dummy registrada al confirmar checkout. */
export interface Purchase {
  usuario: string;
  cliente: string;
  correo: string;
  direccion: string;
  metodoPago: string;
  productos: CartItem[];
  total: string;
  fecha: string;
}
