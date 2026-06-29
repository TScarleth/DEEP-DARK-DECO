import { Injectable } from '@angular/core';

import {
  CATEGORIES,
  FEATURED_PRODUCTS,
  PRODUCTS,
} from '../data/products.data';
import { CategoryInfo, FeaturedProduct, Product } from '../models/product.model';
import { ValidationService } from './validation.service';

/**
 * Catalogo de productos y categorias.
 * Combina datos base con productos creados u ocultos desde admin.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly adminProductsKey = 'productosAdmin';
  private readonly hiddenProductsKey = 'productosAdminOcultos';

  constructor(private readonly validation: ValidationService) {}

  getCategories(): CategoryInfo[] {
    return CATEGORIES;
  }

  getFeaturedProducts(): FeaturedProduct[] {
    return FEATURED_PRODUCTS;
  }

  getCategory(slug: string): CategoryInfo | undefined {
    return CATEGORIES.find((category) => category.slug === slug);
  }

  getProductsByCategory(slug: string): Product[] {
    return this.getAllProducts().filter((product) => product.categoriaSlug === slug);
  }

  /** Une productos base, personalizados y excluye los ocultos por admin. */
  getAllProducts(): Product[] {
    const productosGuardados = JSON.parse(
      localStorage.getItem(this.adminProductsKey) || '[]',
    ) as Product[];
    const productosOcultos = JSON.parse(
      localStorage.getItem(this.hiddenProductsKey) || '[]',
    ) as string[];
    const productosPorNombre = new Map<string, Product>();

    PRODUCTS.forEach((producto) => {
      productosPorNombre.set(this.normalizeName(producto.nombre), producto);
    });

    productosGuardados.forEach((producto) => {
      productosPorNombre.set(this.normalizeName(producto.nombre), producto);
    });

    return Array.from(productosPorNombre.values()).filter(
      (producto) => !productosOcultos.includes(this.normalizeName(producto.nombre)),
    );
  }

  addAdminProduct(product: {
    nombre: string;
    categoria: string;
    stock: number;
    precio: string;
  }): void {
    const productos = this.getAllProducts();
    productos.push({
      id: `admin-${Date.now()}`,
      nombre: this.validation.normalizarTexto(product.nombre),
      categoria: product.categoria,
      categoriaSlug: product.categoria.toLowerCase(),
      descripcion: '',
      precio: product.precio,
      imagen: '/assets/velas.png',
      stock: product.stock,
    });
    this.saveAdminProducts(productos);
  }

  /** Oculta un producto del catalogo sin borrar el historial base. */
  deleteProduct(nombreProducto: string): void {
    const nombreLimpio = this.normalizeName(nombreProducto);
    const productosGuardados = JSON.parse(
      localStorage.getItem(this.adminProductsKey) || '[]',
    ) as Product[];
    const productosOcultos = JSON.parse(
      localStorage.getItem(this.hiddenProductsKey) || '[]',
    ) as string[];

    const productosFiltrados = productosGuardados.filter(
      (producto) => this.normalizeName(producto.nombre) !== nombreLimpio,
    );

    if (!productosOcultos.includes(nombreLimpio)) {
      productosOcultos.push(nombreLimpio);
    }

    localStorage.setItem(this.adminProductsKey, JSON.stringify(productosFiltrados));
    localStorage.setItem(this.hiddenProductsKey, JSON.stringify(productosOcultos));
  }

  private saveAdminProducts(productos: Product[]): void {
    const baseNames = new Set(PRODUCTS.map((product) => this.normalizeName(product.nombre)));
    const customProducts = productos.filter(
      (product) => !baseNames.has(this.normalizeName(product.nombre)),
    );
    localStorage.setItem(this.adminProductsKey, JSON.stringify(customProducts));
  }

  private normalizeName(nombre: string): string {
    return this.validation.normalizarTexto(nombre).toLowerCase();
  }
}
