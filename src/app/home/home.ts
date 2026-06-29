import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { ProductService } from '../core/services/product.service';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Navbar, Footer],
  templateUrl: './home.html',
})
export class Home {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);
  protected readonly products = inject(ProductService);

  readonly featuredProducts = this.products.getFeaturedProducts();
  readonly lookbooks = this.products.getCategories();

  goToRegister(event: Event): void {
    event.preventDefault();
    this.router.navigateByUrl('/register');
  }
}
