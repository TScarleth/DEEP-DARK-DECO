import { AfterViewInit, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import {
  correoValidator,
  isControlInvalid,
  validatorMessage,
} from '../core/validators/app.validators';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recover.html',
})
export class Recover implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  successMessage = '';
  errorMessage = '';

  readonly recoverForm = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.maxLength(60), correoValidator()]],
  });

  ngAfterViewInit(): void {
    setTimeout(() => this.syncCorreoFromDom());
  }

  onCorreoInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.recoverForm.controls.correo.setValue(value);
    this.errorMessage = '';
    this.successMessage = '';
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const correo = this.syncCorreoFromDom();

    if (this.recoverForm.invalid) {
      this.recoverForm.markAllAsTouched();
      return;
    }

    if (!this.auth.correoRegistrado(correo)) {
      this.errorMessage = 'No existe una cuenta registrada con ese correo.';
      return;
    }

    this.successMessage = 'Correo de recuperación enviado. Revisa tu bandeja de entrada.';
    this.recoverForm.reset({ correo: '' });
  }

  isInvalid(): boolean {
    return isControlInvalid(this.recoverForm.get('correo'));
  }

  getError(): string {
    return validatorMessage(this.recoverForm.get('correo'), 'correo');
  }

  private syncCorreoFromDom(): string {
    const input = document.getElementById('correoRecuperar') as HTMLInputElement | null;
    const value = input?.value ?? this.recoverForm.controls.correo.value;

    this.recoverForm.controls.correo.setValue(value);
    this.recoverForm.controls.correo.updateValueAndValidity();

    return value;
  }
}
