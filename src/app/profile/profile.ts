import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';
import { AuthService } from '../core/services/auth.service';
import { CartService } from '../core/services/cart.service';
import { Purchase } from '../core/models/cart-item.model';
import {
  correoValidator,
  isControlInvalid,
  nombreValidator,
  passwordValidator,
  validatorMessage,
} from '../core/validators/app.validators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Navbar, Footer],
  templateUrl: './profile.html',
})
export class Profile {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly cart = inject(CartService);

  readonly currentUser = this.auth.currentUser;

  successMessage = '';
  errorMessage = '';

  readonly profileForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, nombreValidator()]],
    correo: ['', [Validators.required, Validators.maxLength(60), correoValidator()]],
    telefono: ['', Validators.maxLength(20)],
    direccion: ['', Validators.maxLength(120)],
    password: ['', Validators.maxLength(18)],
  });

  constructor() {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const user = this.auth.currentUser();
    if (!user) return;

    this.profileForm.patchValue({
      nombre: user.nombre,
      correo: user.correo,
      telefono: user.telefono ?? '',
      direccion: user.direccion ?? '',
      password: '',
    });
  }

  onFieldInput(
    field: 'nombre' | 'correo' | 'telefono' | 'direccion' | 'password',
    event: Event,
  ): void {
    const value = (event.target as HTMLInputElement).value;
    this.profileForm.controls[field].setValue(value);
    this.errorMessage = '';
    this.successMessage = '';
  }

  onFormKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submit();
    }
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const password = this.profileForm.controls.password.value.trim();
    if (!password) {
      this.profileForm.controls.password.clearValidators();
      this.profileForm.controls.password.setValidators([Validators.maxLength(18)]);
    } else {
      this.profileForm.controls.password.setValidators([
        Validators.maxLength(18),
        passwordValidator(),
      ]);
    }
    this.profileForm.controls.password.updateValueAndValidity();

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const form = this.profileForm.getRawValue();
    const error = this.auth.updateProfile({
      nombre: form.nombre,
      correo: form.correo,
      telefono: form.telefono,
      direccion: form.direccion,
      password: password || undefined,
    });

    if (error) {
      this.errorMessage = error;
      return;
    }

    this.loadCurrentUser();
    this.successMessage = 'Perfil actualizado correctamente.';
    this.profileForm.controls.password.setValue('');
  }

  logout(): void {
    this.auth.logout();
  }

  rolLabel(): string {
    const rol = this.currentUser()?.rol;

    if (rol === 'admin') return 'Administrador';
    if (rol === 'cliente') return 'Cliente';
    return '—';
  }

  passwordPreview(): string {
    const value = this.profileForm.controls.password.value;

    if (!value) return 'Sin cambios';

    return '•'.repeat(Math.min(value.length, 12));
  }

  isCliente(): boolean {
    return this.currentUser()?.rol === 'cliente';
  }

  myPurchases(): Purchase[] {
    return this.isCliente() ? this.cart.getPurchasesForCurrentUser() : [];
  }

  isInvalid(
    field: 'nombre' | 'correo' | 'telefono' | 'direccion' | 'password',
  ): boolean {
    return isControlInvalid(this.profileForm.get(field));
  }

  getError(
    field: 'nombre' | 'correo' | 'telefono' | 'direccion' | 'password',
  ): string {
    const control = this.profileForm.get(field);

    if (field === 'telefono' && control?.errors?.['maxlength']) {
      return 'Teléfono máximo 20 caracteres';
    }

    if (field === 'direccion' && control?.errors?.['maxlength']) {
      return 'Dirección máximo 120 caracteres';
    }

    if (field === 'password' && !control?.value) {
      return '';
    }

    if (field === 'telefono' || field === 'direccion') {
      return '';
    }

    return validatorMessage(control, field === 'password' ? 'password' : field);
  }
}
