import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { User, ProfileUpdate } from '../models/user.model';
import { ValidationService } from './validation.service';

/**
 * Gestiona autenticacion, registro y perfil.
 * Persiste usuarios en `localStorage` y la sesion activa en `sessionStorage`.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionKey = 'sesion';
  private readonly usersKey = 'usuarios';

  /** Usuario autenticado en la sesion actual. */
  readonly currentUser = signal<User | null>(this.loadSession());

  constructor(
    private readonly router: Router,
    private readonly validation: ValidationService,
  ) {}

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    return this.currentUser()?.rol === 'admin';
  }

  /**
   * Valida credenciales y abre sesion.
   * @returns Mensaje de error o `null` si el login fue exitoso.
   */
  login(correo: string, password: string): string | null {
    const correoIngresado = this.validation.normalizarCorreo(correo);
    const passwordIngresada = this.validation.normalizarPassword(password);

    const errorCorreo = this.validation.mensajeCorreo(correoIngresado);
    if (errorCorreo) return errorCorreo;

    const errorPassword = this.validation.mensajePassword(passwordIngresada);
    if (errorPassword) return errorPassword;

    const usuarios = this.getUsers();
    const user = this.buscarUsuarioPorCorreo(correoIngresado, usuarios);

    if (!user) return 'Usuario o contraseña incorrectos';

    if (this.validation.normalizarPassword(user.password) !== passwordIngresada) {
      return 'Usuario o contraseña incorrectos';
    }

    sessionStorage.setItem(this.sessionKey, JSON.stringify(user));
    this.currentUser.set(user);
    return null;
  }

  /**
   * Registra un usuario nuevo en `localStorage`.
   * @returns Mensaje de error o `null` si el registro fue exitoso.
   */
  register(user: User): string | null {
    const errorNombre = this.validation.mensajeNombre(user.nombre);
    if (errorNombre) return errorNombre;

    const errorCorreo = this.validation.mensajeCorreo(user.correo);
    if (errorCorreo) return errorCorreo;

    const errorPassword = this.validation.mensajePassword(user.password);
    if (errorPassword) return errorPassword;

    const usuarios = this.getUsers();
    const correoLimpio = this.validation.normalizarCorreo(user.correo);

    if (
      usuarios.some(
        (usuario) => this.validation.normalizarCorreo(usuario.correo) === correoLimpio,
      )
    ) {
      return 'Este correo ya está registrado';
    }

    usuarios.push({
      nombre: this.validation.normalizarTexto(user.nombre),
      correo: correoLimpio,
      password: this.validation.normalizarPassword(user.password),
      rol: user.rol,
    });

    localStorage.setItem(this.usersKey, JSON.stringify(usuarios));
    return null;
  }

  /**
   * Actualiza datos del usuario autenticado en `localStorage` y `sessionStorage`.
   * @returns Mensaje de error o `null` si el perfil se guardo correctamente.
   */
  updateProfile(data: ProfileUpdate): string | null {
    const current = this.currentUser();
    if (!current) return 'Sesión no activa';

    const errorNombre = this.validation.mensajeNombre(data.nombre);
    if (errorNombre) return errorNombre;

    const errorCorreo = this.validation.mensajeCorreo(data.correo);
    if (errorCorreo) return errorCorreo;

    const telefono = this.validation.normalizarTexto(data.telefono);
    if (telefono.length > 20) return 'Teléfono máximo 20 caracteres';

    const direccion = this.validation.normalizarTexto(data.direccion);
    if (direccion.length > 120) return 'Dirección máximo 120 caracteres';

    const passwordIngresada = this.validation.normalizarPassword(data.password ?? '');
    if (passwordIngresada) {
      const errorPassword = this.validation.mensajePassword(passwordIngresada);
      if (errorPassword) return errorPassword;
    }

    const usuarios = this.getUsers();
    const correoActual = this.validation.normalizarCorreo(current.correo);
    const correoNuevo = this.validation.normalizarCorreo(data.correo);
    const index = usuarios.findIndex(
      (usuario) => this.validation.normalizarCorreo(usuario.correo) === correoActual,
    );

    if (index === -1) return 'Usuario no encontrado';

    if (
      correoNuevo !== correoActual &&
      usuarios.some(
        (usuario) => this.validation.normalizarCorreo(usuario.correo) === correoNuevo,
      )
    ) {
      return 'Este correo ya está registrado';
    }

    const updated: User = {
      ...usuarios[index],
      nombre: this.validation.normalizarTexto(data.nombre),
      correo: correoNuevo,
      telefono,
      direccion,
      password: passwordIngresada || usuarios[index].password,
    };

    usuarios[index] = updated;
    localStorage.setItem(this.usersKey, JSON.stringify(usuarios));
    sessionStorage.setItem(this.sessionKey, JSON.stringify(updated));
    this.currentUser.set(updated);
    return null;
  }

  /** Cierra la sesion activa y redirige al login. */
  logout(): void {
    sessionStorage.removeItem(this.sessionKey);
    this.currentUser.set(null);
    this.router.navigateByUrl('/login');
  }

  /** Lista segura de usuarios registrados desde `localStorage`. */
  getUsers(): User[] {
    try {
      const raw = localStorage.getItem(this.usersKey);
      if (!raw) return [];

      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed.filter(
        (item): item is User =>
          !!item &&
          typeof item === 'object' &&
          typeof (item as User).correo === 'string' &&
          typeof (item as User).password === 'string',
      );
    } catch {
      return [];
    }
  }

  /** Busca un usuario por correo normalizado. */
  buscarUsuarioPorCorreo(correo: string, usuarios = this.getUsers()): User | undefined {
    const correoLimpio = this.validation.normalizarCorreo(correo);
    if (!correoLimpio) return undefined;

    return usuarios.find(
      (usuario) => this.validation.normalizarCorreo(usuario.correo) === correoLimpio,
    );
  }

  /** Indica si el correo ya existe en la base local de usuarios. */
  correoRegistrado(correo: string): boolean {
    return !!this.buscarUsuarioPorCorreo(correo);
  }

  private loadSession(): User | null {
    const raw = sessionStorage.getItem(this.sessionKey);
    return raw ? (JSON.parse(raw) as User) : null;
  }
}
