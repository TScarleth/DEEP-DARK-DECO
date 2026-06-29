/** Rol disponible dentro de la aplicacion. */
export type UserRole = 'cliente' | 'admin';

/** Usuario almacenado en localStorage y sessionStorage. */
export interface User {
  nombre: string;
  correo: string;
  password: string;
  rol: UserRole;
  telefono?: string;
  direccion?: string;
}

/** Datos editables desde el formulario de perfil. */
export interface ProfileUpdate {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  password?: string;
}
