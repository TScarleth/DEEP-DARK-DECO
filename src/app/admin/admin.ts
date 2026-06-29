import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { AdminService } from '../core/services/admin.service';
import { isControlInvalid, validatorMessage } from '../core/validators/app.validators';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Navbar, Footer],
  templateUrl: './admin.html',
})
export class Admin {
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthService);
  protected readonly admin = inject(AdminService);

  readonly productForm = this.fb.group({
    productoNombre: ['', [Validators.required, Validators.maxLength(60)]],
    productoCategoria: ['', Validators.required],
    productoStock: [null as number | null, [Validators.required, Validators.min(0), Validators.max(999)]],
    productoPrecio: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  onFormKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submitProduct();
    }
  }

  submitProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const form = this.productForm.getRawValue();

    if (
      !form.productoNombre ||
      !form.productoCategoria ||
      form.productoStock === null ||
      form.productoPrecio === null
    ) {
      return;
    }

    this.admin.addProduct({
      nombre: form.productoNombre,
      categoria: form.productoCategoria,
      stock: form.productoStock,
      precio: form.productoPrecio,
    });

    this.productForm.reset({
      productoNombre: '',
      productoCategoria: '',
      productoStock: null,
      productoPrecio: null,
    });
  }

  deleteProduct(nombre: string): void {
    this.admin.deleteProduct(nombre);
  }

  isInvalid(
    field: 'productoNombre' | 'productoCategoria' | 'productoStock' | 'productoPrecio',
  ): boolean {
    return isControlInvalid(this.productForm.get(field));
  }

  getError(
    field: 'productoNombre' | 'productoCategoria' | 'productoStock' | 'productoPrecio',
  ): string {
    return validatorMessage(this.productForm.get(field), 'generico');
  }
}
