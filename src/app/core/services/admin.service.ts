import { Injectable, computed, signal } from '@angular/core';

import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { ProductService } from './product.service';

/** Operaciones del panel admin: estadisticas, usuarios, productos y compras. */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly refresh = signal(0);

  /** Resumen calculado para las tarjetas del dashboard admin. */
  readonly stats = computed(() => {
    this.refresh();
    const productos = this.productService.getAllProducts();
    const usuarios = this.auth.getUsers();
    const compras = this.cart.getPurchases();

    return {
      usuarios: usuarios.length,
      productos: productos.length,
      stock: productos.reduce((total, producto) => total + Number(producto.stock), 0),
      compras: compras.length,
    };
  });

  constructor(
    private readonly auth: AuthService,
    private readonly cart: CartService,
    private readonly productService: ProductService,
  ) {}

  getUsers(): User[] {
    this.refresh();
    return this.auth.getUsers();
  }

  getProducts(): Product[] {
    this.refresh();
    return this.productService.getAllProducts();
  }

  getRecentPurchases() {
    this.refresh();
    return this.cart.getPurchases().slice(-5).reverse();
  }

  addProduct(data: {
    nombre: string;
    categoria: string;
    stock: number;
    precio: number;
  }): void {
    this.productService.addAdminProduct({
      nombre: data.nombre,
      categoria: data.categoria,
      stock: data.stock,
      precio: '$' + Number(data.precio).toLocaleString('es-CL'),
    });
    this.refresh.update((value) => value + 1);
  }

  deleteProduct(nombre: string): void {
    this.productService.deleteProduct(nombre);
    this.refresh.update((value) => value + 1);
  }
}
