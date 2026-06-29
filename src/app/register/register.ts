import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { UserRole } from '../core/models/user.model';
import { AuthService } from '../core/services/auth.service';
import {
  correoValidator,
  groupErrorMessage,
  isControlInvalid,
  nombreValidator,
  passwordMatchValidator,
  passwordValidator,
  validatorMessage,
} from '../core/validators/app.validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly registerForm = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, nombreValidator()]],
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
      confirmar: ['', Validators.required],
      rol: ['', Validators.required],
    },
    { validators: passwordMatchValidator('password', 'confirmar') },
  );

  errorCorreo = '';
  successMessage = '';

  onFieldInput(
    field: 'nombre' | 'correo' | 'password' | 'confirmar',
    event: Event,
  ): void {
    const value = (event.target as HTMLInputElement).value;

    if (field === 'correo') {
      this.errorCorreo = '';
      this.successMessage = '';
    }

    this.registerForm.controls[field].setValue(value);
    this.registerForm.updateValueAndValidity();
  }

  onRolChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.registerForm.controls.rol.setValue(value);
    this.registerForm.updateValueAndValidity();
  }

  onFormKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submit();
    }
  }

  submit(): void {
    this.errorCorreo = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { nombre, correo, password, rol } = this.registerForm.getRawValue();
    const error = this.auth.register({
      nombre,
      correo,
      password,
      rol: rol as UserRole,
    });

    if (error) {
      this.errorCorreo = error;
      return;
    }

    this.successMessage = 'Registro exitoso. Ahora puedes iniciar sesión.';
    this.registerForm.reset({
      nombre: '',
      correo: '',
      password: '',
      confirmar: '',
      rol: '',
    });
  }

  isInvalid(field: 'nombre' | 'correo' | 'password' | 'confirmar' | 'rol'): boolean {
    if (field === 'correo' && this.errorCorreo) {
      return true;
    }

    return isControlInvalid(this.registerForm.get(field));
  }

  getError(field: 'nombre' | 'correo' | 'password' | 'confirmar' | 'rol'): string {
    if (field === 'correo' && this.errorCorreo) {
      return this.errorCorreo;
    }

    if (field === 'confirmar') {
      const confirmError = groupErrorMessage(
        this.registerForm,
        'passwordMismatch',
        'Las contraseñas no coinciden',
      );

      if (confirmError && (this.registerForm.get('confirmar')?.touched || this.registerForm.touched)) {
        return confirmError;
      }
    }

    return validatorMessage(this.registerForm.get(field), field);
  }
}
