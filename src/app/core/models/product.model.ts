/** Producto disponible en catalogo y carrito. */
export interface Product {
  id: string;
  nombre: string;
  categoria: string;
  categoriaSlug: string;
  descripcion: string;
  precio: string;
  oldPrice?: string;
  imagen: string;
  stock: number;
}

/** Producto destacado mostrado en el home. */
export interface FeaturedProduct {
  nombre: string;
  precio: string;
  imagen: string;
  categorySlug: string;
}

/** Metadatos de una categoria de la tienda. */
export interface CategoryInfo {
  slug: string;
  title: string;
  breadcrumb: string;
  lookbookImage: string;
}
