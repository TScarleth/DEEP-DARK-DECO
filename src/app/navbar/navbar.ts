import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { CartService } from '../core/services/cart.service';
import { ProductService } from '../core/services/product.service';

/** Barra superior con accesos rapidos y menu de navegacion desplegable. */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);
  protected readonly cart = inject(CartService);
  protected readonly products = inject(ProductService);

  readonly menuOpen = signal(false);
  readonly categories = this.products.getCategories();

  /** Abre o cierra el panel del menu (icono menu). */
  toggleMenu(event: Event): void {
    event.preventDefault();
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.closeMenu();
    this.auth.logout();
  }

  /** Etiqueta legible de la pagina actual para el bloque "Donde estoy?". */
  currentLocation(): string {
    const url = this.router.url.split('?')[0];

    if (url === '/' || url === '') {
      return 'Inicio';
    }

    if (url === '/cart') {
      return 'Carrito de compras';
    }

    if (url === '/admin') {
      return 'Panel administrador';
    }

    if (url === '/profile') {
      return 'Mi perfil';
    }

    if (url === '/login') {
      return 'Iniciar sesión';
    }

    if (url === '/register') {
      return 'Registro de usuario';
    }

    if (url === '/recover') {
      return 'Recuperar contraseña';
    }

    const categoryMatch = url.match(/^\/products\/([^/]+)$/);
    if (categoryMatch) {
      const category = this.products.getCategory(categoryMatch[1]);
      return category ? `Categoría ${category.title}` : 'Tienda';
    }

    return 'Deep Dark Deco';
  }
}
