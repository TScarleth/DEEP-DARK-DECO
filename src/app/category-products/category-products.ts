import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Product } from '../core/models/product.model';
import { CartService } from '../core/services/cart.service';
import { ProductService } from '../core/services/product.service';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [RouterLink, Navbar, Footer],
  templateUrl: './category-products.html',
})
export class CategoryProducts {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);

  readonly category = signal(this.productService.getCategory(this.route.snapshot.paramMap.get('slug') || ''));
  readonly products = signal<Product[]>([]);
  readonly addedProduct = signal<string | null>(null);

  constructor() {
    this.loadCategory(this.route.snapshot.paramMap.get('slug') || '');
    this.route.paramMap.subscribe((params) => this.loadCategory(params.get('slug') || ''));
  }

  addToCart(product: Product): void {
    this.cart.addProduct(product);
    this.addedProduct.set(product.id);
    setTimeout(() => this.addedProduct.set(null), 900);
  }

  onAddToCartClick(event: Event, product: Product): void {
    event.preventDefault();
    this.addToCart(product);
  }

  onAddToCartKeyup(event: KeyboardEvent, product: Product): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.addToCart(product);
    }
  }

  private loadCategory(slug: string): void {
    this.category.set(this.productService.getCategory(slug));
    this.products.set(this.productService.getProductsByCategory(slug));
  }
}
