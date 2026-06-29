import { Injectable } from '@angular/core';

/** Limites compartidos entre validaciones de formulario y servicios. */
export const LIMITES = {
  nombreMin: 2,
  nombreMax: 40,
  correoMax: 60,
  passwordMin: 8,
  passwordMax: 18,
};

/**
 * Reglas de validacion reutilizables para auth, perfil y checkout.
 * Centraliza normalizacion y mensajes de error en espanol.
 */
@Injectable({ providedIn: 'root' })
export class ValidationService {
  normalizarTexto(valor: string): string {
    return valor.trim();
  }

  normalizarCorreo(valor: string): string {
    return valor.trim().toLowerCase();
  }

  normalizarPassword(valor: string): string {
    return valor.trim();
  }

  estaVacio(valor: string): boolean {
    return this.normalizarTexto(valor) === '';
  }

  validarCorreo(correo: string): boolean {
    const correoLimpio = this.normalizarCorreo(correo);
    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patron.test(correoLimpio) && correoLimpio.length <= LIMITES.correoMax;
  }

  validarNombre(nombre: string): boolean {
    const nombreLimpio = this.normalizarTexto(nombre);
    const patron = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
    return (
      nombreLimpio.length >= LIMITES.nombreMin &&
      nombreLimpio.length <= LIMITES.nombreMax &&
      patron.test(nombreLimpio)
    );
  }

  validarPassword(password: string): boolean {
    const tieneLetra = /[A-Za-zÁÉÍÓÚáéíóúÑñÜü]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    const tieneEspecial = /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9]/.test(password);
    const largoCorrecto =
      password.length >= LIMITES.passwordMin && password.length <= LIMITES.passwordMax;
    return tieneLetra && tieneNumero && tieneEspecial && largoCorrecto;
  }

  /** @returns Mensaje de error o `null` si el correo es valido. */
  mensajeCorreo(correo: string): string | null {
    if (this.estaVacio(correo)) return 'Correo requerido';
    if (this.normalizarCorreo(correo).length > LIMITES.correoMax) {
      return `Máximo ${LIMITES.correoMax} caracteres`;
    }
    if (!this.validarCorreo(correo)) return 'Correo inválido';
    return null;
  }

  /** @returns Mensaje de error o `null` si el nombre es valido. */
  mensajeNombre(nombre: string): string | null {
    if (this.estaVacio(nombre)) return 'Nombre requerido';
    if (!this.validarNombre(nombre)) {
      return `Solo letras y espacios, entre ${LIMITES.nombreMin} y ${LIMITES.nombreMax} caracteres`;
    }
    return null;
  }

  /** @returns Mensaje de error o `null` si la contraseña es valida. */
  mensajePassword(password: string): string | null {
    if (this.estaVacio(password)) return 'Contraseña requerida';
    if (!this.validarPassword(password)) {
      return `Debe tener ${LIMITES.passwordMin}-${LIMITES.passwordMax} caracteres, letras, números y un carácter especial`;
    }
    return null;
  }
}
