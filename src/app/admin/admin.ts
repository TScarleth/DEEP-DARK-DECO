import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { AdminService } from '../core/services/admin.service';
import { Product } from '../core/models/product.model';
import { isControlInvalid, validatorMessage } from '../core/validators/app.validators';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Navbar, Footer],
  templateUrl: './admin.html',
})
export class Admin implements OnInit {
  @ViewChild('mantenedorProductos') private readonly mantenedorProductos?: ElementRef<HTMLElement>;

  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthService);
  protected readonly admin = inject(AdminService);
  protected readonly producto = inject(ProductoService);

  protected readonly productosApi = signal<Product[]>([]);
  protected readonly productoEnEdicion = signal<Product | null>(null);
  protected readonly successMessage = signal('');
  protected readonly imagenPreview = signal('');

  readonly productForm = this.fb.group({
    productoNombre: ['', [Validators.required, Validators.maxLength(60)]],
    productoCategoria: ['', Validators.required],
    productoDescripcion: ['', [Validators.required, Validators.maxLength(500)]],
    productoImagen: ['', Validators.maxLength(200)],
    productoStock: [null as number | null, [Validators.required, Validators.min(0), Validators.max(999)]],
    productoPrecio: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.probarApi();
  }

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
      !form.productoDescripcion ||
      form.productoStock === null ||
      form.productoPrecio === null
    ) {
      return;
    }

    const productoPayload: Product = {
      id: this.productoEnEdicion()?.id ?? '',
      nombre: form.productoNombre,
      categoria: form.productoCategoria,
      categoriaSlug: form.productoCategoria.toLowerCase(),
      descripcion: form.productoDescripcion,
      precio: '$' + Number(form.productoPrecio).toLocaleString('es-CL'),
      imagen: form.productoImagen?.trim() || this.productoEnEdicion()?.imagen || 'assets/velas.png',
      stock: form.productoStock,
      ...(this.productoEnEdicion()?.oldPrice ? { oldPrice: this.productoEnEdicion()!.oldPrice } : {}),
    };

    const productoEnEdicion = this.productoEnEdicion();

    if (productoEnEdicion) {
      this.producto.actualizarProducto(productoEnEdicion.id, productoPayload).subscribe(() => {
        this.finalizarEnvioProducto('Producto actualizado con éxito');
      });
      return;
    }

    this.producto.crearProducto(productoPayload).subscribe(() => {
      this.finalizarEnvioProducto('Producto agregado con éxito');
    });
  }

  onImagenSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const imagen = `assets/${file.name}`;
    this.productForm.patchValue({ productoImagen: imagen });
    this.imagenPreview.set(URL.createObjectURL(file));
  }

  editProduct(producto: Product): void {
    this.productoEnEdicion.set(producto);
    this.productForm.patchValue({
      productoNombre: producto.nombre,
      productoCategoria: this.mapCategoriaToForm(producto.categoria),
      productoDescripcion: producto.descripcion,
      productoImagen: producto.imagen,
      productoStock: producto.stock,
      productoPrecio: this.parsePrecio(producto.precio),
    });
    this.imagenPreview.set(this.resolveImagenUrl(producto.imagen));

    this.mantenedorProductos?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  private finalizarEnvioProducto(mensaje: string): void {
    this.showSuccess(mensaje);
    this.probarApi();
    this.productoEnEdicion.set(null);
    this.imagenPreview.set('');
    this.productForm.reset({
      productoNombre: '',
      productoCategoria: '',
      productoDescripcion: '',
      productoImagen: '',
      productoStock: null,
      productoPrecio: null,
    });
  }

  private showSuccess(mensaje: string): void {
    this.successMessage.set(mensaje);
    setTimeout(() => this.successMessage.set(''), 3200);
  }

  private resolveImagenUrl(imagen: string): string {
    if (!imagen) {
      return '';
    }

    if (imagen.startsWith('http') || imagen.startsWith('blob:') || imagen.startsWith('data:')) {
      return imagen;
    }

    return imagen.startsWith('/') ? imagen : `/${imagen}`;
  }

  private parsePrecio(precio: string): number {
    return Number(precio.replace(/[^\d]/g, ''));
  }

  private mapCategoriaToForm(categoria: string): string {
    return categoria === 'Salón' ? 'Salon' : categoria;
  }

  deleteProduct(nombre: string): void {
    const producto = this.productosApi().find((item) => item.nombre === nombre);

    if (!producto) {
      return;
    }

    this.producto.eliminarProducto(producto.id).subscribe(() => {
      if (this.productoEnEdicion()?.id === producto.id) {
        this.productoEnEdicion.set(null);
        this.imagenPreview.set('');
        this.productForm.reset({
          productoNombre: '',
          productoCategoria: '',
          productoDescripcion: '',
          productoImagen: '',
          productoStock: null,
          productoPrecio: null,
        });
      }

      this.showSuccess('Producto eliminado con éxito');
      this.probarApi();
    });
  }

  isInvalid(
    field:
      | 'productoNombre'
      | 'productoCategoria'
      | 'productoDescripcion'
      | 'productoImagen'
      | 'productoStock'
      | 'productoPrecio',
  ): boolean {
    return isControlInvalid(this.productForm.get(field));
  }

  getError(
    field:
      | 'productoNombre'
      | 'productoCategoria'
      | 'productoDescripcion'
      | 'productoImagen'
      | 'productoStock'
      | 'productoPrecio',
  ): string {
    return validatorMessage(this.productForm.get(field), 'generico');
  }

  probarApi(): void {
    this.producto.getProductos().subscribe((productos) => {
      console.log(productos);
      this.productosApi.set(productos);
    });
  }
}
