import { Injectable, computed, signal } from '@angular/core';

import { CartItem, Purchase } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';

/**
 * Carrito de compras persistente en `localStorage`.
 * Tambien registra compras dummy para el panel admin.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly cartKey = 'carrito';
  private readonly purchasesKey = 'comprasDemo';

  private readonly items = signal<CartItem[]>(this.loadCart());

  readonly cartItems = this.items.asReadonly();
  readonly cartCount = computed(() =>
    this.items().reduce((total, item) => total + item.cantidad, 0),
  );
  readonly cartTotal = computed(() =>
    this.items().reduce(
      (sum, item) => sum + this.precioANumero(item.precio) * item.cantidad,
      0,
    ),
  );

  constructor(private readonly auth: AuthService) {}

  addProduct(product: Product): void {
    this.addItem({
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      categoria: product.categoria,
      cantidad: 1,
    });
  }

  addItem(producto: CartItem): void {
    const carrito = [...this.items()];
    const existente = carrito.find((item) => item.nombre === producto.nombre);

    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({ ...producto });
    }

    this.saveCart(carrito);
  }

  modifyItem(action: 'plus' | 'minus' | 'remove', index: number): void {
    const carrito = [...this.items()];
    const item = carrito[index];

    if (!item) return;

    if (action === 'plus') item.cantidad += 1;
    if (action === 'minus') item.cantidad -= 1;
    if (action === 'remove' || item.cantidad <= 0) carrito.splice(index, 1);

    this.saveCart(carrito);
  }

  /**
   * Confirma una venta dummy y la guarda en historial.
   * @returns Mensaje de error o `null` si la compra se registro.
   */
  checkout(data: {
    nombre: string;
    correo: string;
    direccion: string;
    metodoPago: string;
  }): string | null {
    const carrito = this.items();
    if (carrito.length === 0) {
      return 'Agrega productos antes de confirmar la venta.';
    }

    const compra: Purchase = {
      usuario: this.auth.currentUser()?.correo || 'sin sesion',
      cliente: data.nombre,
      correo: data.correo,
      direccion: data.direccion,
      metodoPago: data.metodoPago,
      productos: carrito,
      total: this.formatearPrecio(this.cartTotal()),
      fecha: new Date().toLocaleString('es-CL'),
    };

    const compras = JSON.parse(localStorage.getItem(this.purchasesKey) || '[]') as Purchase[];
    compras.push(compra);
    localStorage.setItem(this.purchasesKey, JSON.stringify(compras));
    this.saveCart([]);
    return null;
  }

  getPurchases(): Purchase[] {
    return JSON.parse(localStorage.getItem(this.purchasesKey) || '[]') as Purchase[];
  }

  /** Compras dummy asociadas al correo de la sesion que confirmo el checkout. */
  getPurchasesForUser(correo: string): Purchase[] {
    const correoLimpio = correo.trim().toLowerCase();
    if (!correoLimpio) return [];

    return this.getPurchases()
      .filter((compra) => compra.usuario.trim().toLowerCase() === correoLimpio)
      .slice()
      .reverse();
  }

  /** Historial de compras del usuario autenticado. */
  getPurchasesForCurrentUser(): Purchase[] {
    const correo = this.auth.currentUser()?.correo;
    return correo ? this.getPurchasesForUser(correo) : [];
  }

  formatearPrecio(valor: number): string {
    return '$' + Number(valor).toLocaleString('es-CL');
  }

  precioANumero(precio: string): number {
    return Number(String(precio).replace(/[^0-9]/g, ''));
  }

  private saveCart(carrito: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(carrito));
    this.items.set(carrito);
  }

  private loadCart(): CartItem[] {
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]') as CartItem[];
  }
}
