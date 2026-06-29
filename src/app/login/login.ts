import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import {
  correoValidator,
  isControlInvalid,
  passwordValidator,
  validatorMessage,
} from '../core/validators/app.validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loginForm = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.maxLength(60), correoValidator()]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(18),
        passwordValidator(),
      ],
    ],
  });

  errorCorreo = '';
  errorPassword = '';

  onCorreoInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.errorCorreo = '';
    this.loginForm.controls.correo.setValue(value);
  }

  onPasswordInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.errorPassword = '';
    this.loginForm.controls.password.setValue(value);
  }

  onFormKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submit();
    }
  }

  submit(): void {
    this.errorCorreo = '';
    this.errorPassword = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { correo, password } = this.loginForm.getRawValue();
    const error = this.auth.login(correo, password);

    if (error === 'Correo requerido' || error === 'Correo inválido' || error?.includes('Máximo')) {
      this.errorCorreo = error;
      return;
    }

    if (error) {
      this.errorPassword = error;
      return;
    }

    this.router.navigateByUrl('/');
  }

  isInvalid(field: 'correo' | 'password'): boolean {
    return (
      isControlInvalid(this.loginForm.get(field)) ||
      !!(field === 'correo' ? this.errorCorreo : this.errorPassword)
    );
  }

  getError(field: 'correo' | 'password'): string {
    if (field === 'correo' && this.errorCorreo) {
      return this.errorCorreo;
    }

    if (field === 'password' && this.errorPassword) {
      return this.errorPassword;
    }

    return validatorMessage(this.loginForm.get(field), field);
  }
}
