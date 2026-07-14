import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from '../core/models/product.model';

/**
 * Servicio para consumir la API REST de productos.
 */
@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly apiUrl = 'http://localhost:3000/productos';

  constructor(private readonly http: HttpClient) {}

  /** Obtiene la lista de productos desde el endpoint GET /productos. */
  getProductos(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  /** Crea un producto en el endpoint POST /productos. */
  crearProducto(producto: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, producto);
  }

  /** Elimina un producto en el endpoint DELETE /productos/:id. */
  eliminarProducto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /** Actualiza un producto en el endpoint PUT /productos/:id. */
  actualizarProducto(id: string, producto: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, producto);
  }
}
