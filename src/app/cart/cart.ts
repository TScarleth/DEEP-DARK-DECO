import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CartService } from '../core/services/cart.service';
import {
  correoValidator,
  isControlInvalid,
  validatorMessage,
} from '../core/validators/app.validators';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ReactiveFormsModule, Navbar, Footer],
  templateUrl: './cart.html',
})
export class Cart {
  private readonly fb = inject(FormBuilder);
  protected readonly cart = inject(CartService);

  checkoutMessage = '';

  readonly checkoutForm = this.fb.nonNullable.group({
    checkoutNombre: ['', [Validators.required, Validators.maxLength(60)]],
    checkoutCorreo: ['', [Validators.required, Validators.maxLength(60), correoValidator()]],
    checkoutTelefono: ['', [Validators.required, Validators.maxLength(20)]],
    checkoutDireccion: ['', [Validators.required, Validators.maxLength(120)]],
    checkoutCiudad: ['', [Validators.required, Validators.maxLength(60)]],
    checkoutPago: ['', Validators.required],
    checkoutNotas: ['', Validators.maxLength(180)],
  });

  modify(action: 'plus' | 'minus' | 'remove', index: number): void {
    this.cart.modifyItem(action, index);
  }

  onFormKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submitCheckout();
    }
  }

  submitCheckout(): void {
    this.checkoutMessage = '';

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const form = this.checkoutForm.getRawValue();
    const error = this.cart.checkout({
      nombre: form.checkoutNombre,
      correo: form.checkoutCorreo,
      direccion: form.checkoutDireccion,
      metodoPago: form.checkoutPago,
    });

    if (error) {
      this.checkoutMessage = error;
      return;
    }

    this.checkoutForm.reset({
      checkoutNombre: '',
      checkoutCorreo: '',
      checkoutTelefono: '',
      checkoutDireccion: '',
      checkoutCiudad: '',
      checkoutPago: '',
      checkoutNotas: '',
    });
    this.checkoutMessage =
      'Venta dummy registrada correctamente. No se realizo ningun cobro real.';
  }

  isInvalid(
    field:
      | 'checkoutNombre'
      | 'checkoutCorreo'
      | 'checkoutTelefono'
      | 'checkoutDireccion'
      | 'checkoutCiudad'
      | 'checkoutPago',
  ): boolean {
    return isControlInvalid(this.checkoutForm.get(field));
  }

  getError(
    field:
      | 'checkoutNombre'
      | 'checkoutCorreo'
      | 'checkoutTelefono'
      | 'checkoutDireccion'
      | 'checkoutCiudad'
      | 'checkoutPago',
  ): string {
    if (field === 'checkoutCorreo') {
      return validatorMessage(this.checkoutForm.get(field), 'correo');
    }

    return validatorMessage(this.checkoutForm.get(field), 'generico');
  }
}
