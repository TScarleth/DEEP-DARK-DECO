import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { LIMITES } from '../services/validation.service';

/** Campos soportados por `validatorMessage`. */
export type FieldType =
  | 'correo'
  | 'nombre'
  | 'password'
  | 'confirmar'
  | 'rol'
  | 'generico';

function normalizarTexto(valor: string): string {
  return valor.trim();
}

function normalizarCorreo(valor: string): string {
  return valor.trim().toLowerCase();
}

/** Validador reactivo para correo electronico. */
export function correoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');

    if (normalizarTexto(value) === '') {
      return { required: true };
    }

    if (normalizarCorreo(value).length > LIMITES.correoMax) {
      return { maxLength: true };
    }

    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patron.test(normalizarCorreo(value))) {
      return { email: true };
    }

    return null;
  };
}

/** Validador reactivo para nombre de usuario. */
export function nombreValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');

    if (normalizarTexto(value) === '') {
      return { required: true };
    }

    const nombreLimpio = normalizarTexto(value);
    const patron = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

    if (
      nombreLimpio.length < LIMITES.nombreMin ||
      nombreLimpio.length > LIMITES.nombreMax ||
      !patron.test(nombreLimpio)
    ) {
      return { nombreInvalido: true };
    }

    return null;
  };
}

/** Validador reactivo para contraseña segura. */
export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');

    if (normalizarTexto(value) === '') {
      return { required: true };
    }

    const tieneLetra = /[A-Za-zÁÉÍÓÚáéíóúÑñÜü]/.test(value);
    const tieneNumero = /[0-9]/.test(value);
    const tieneEspecial = /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9]/.test(value);
    const largoCorrecto =
      value.length >= LIMITES.passwordMin && value.length <= LIMITES.passwordMax;

    if (!tieneLetra || !tieneNumero || !tieneEspecial || !largoCorrecto) {
      return { passwordInvalida: true };
    }

    return null;
  };
}

/** Compara contraseña y confirmacion dentro de un `FormGroup`. */
export function passwordMatchValidator(
  passwordKey: string,
  confirmKey: string,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = String(group.get(passwordKey)?.value ?? '');
    const confirmar = String(group.get(confirmKey)?.value ?? '');

    if (normalizarTexto(confirmar) === '') {
      return null;
    }

    if (password !== confirmar) {
      return { passwordMismatch: true };
    }

    return null;
  };
}

/** Traduce errores de un control a mensajes listos para la UI. */
export function validatorMessage(
  control: AbstractControl | null,
  field: FieldType,
): string {
  if (!control?.errors) {
    return '';
  }

  if (control.errors['required']) {
    switch (field) {
      case 'correo':
        return 'Correo requerido';
      case 'nombre':
        return 'Nombre requerido';
      case 'password':
        return 'Contraseña requerida';
      case 'confirmar':
        return 'Debe confirmar la contraseña';
      case 'rol':
        return 'Seleccione un tipo de usuario';
      default:
        return 'Campo requerido';
    }
  }

  if (control.errors['email'] || control.errors['maxLength']) {
    if (field === 'correo' && control.errors['maxLength']) {
      return `Máximo ${LIMITES.correoMax} caracteres`;
    }

    if (field === 'correo') {
      return 'Correo inválido';
    }
  }

  if (control.errors['nombreInvalido']) {
    return `Solo letras y espacios, entre ${LIMITES.nombreMin} y ${LIMITES.nombreMax} caracteres`;
  }

  if (control.errors['passwordInvalida']) {
    return `Debe tener ${LIMITES.passwordMin}-${LIMITES.passwordMax} caracteres, letras, números y un carácter especial`;
  }

  return '';
}

/** Obtiene mensaje de error a nivel de grupo (por ejemplo, contraseñas distintas). */
export function groupErrorMessage(
  group: AbstractControl | null,
  errorKey: string,
  message: string,
): string {
  if (!group?.errors?.[errorKey]) {
    return '';
  }

  return message;
}

/** Indica si un control debe mostrarse como invalido en pantalla. */
export function isControlInvalid(control: AbstractControl | null): boolean {
  return !!(control && control.invalid && (control.dirty || control.touched));
}
