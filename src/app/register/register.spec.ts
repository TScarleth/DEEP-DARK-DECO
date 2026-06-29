import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authService: AuthService;

  // Prepara un registro limpio antes de cada prueba (sin usuarios previos en localStorage).
  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // Prueba 4: verifica que el componente Register se instancia correctamente en el entorno de pruebas.
  it('deberia crear el componente de registro', () => {
    expect(component).toBeTruthy();
  });

  // Prueba 5: al enviar el formulario vacio, debe marcarse como tocado para mostrar
  // validaciones, sin mensaje de exito ni error de correo duplicado.
  it('deberia marcar el formulario como tocado al enviar datos invalidos', () => {
    component.submit();

    expect(component.registerForm.touched).toBeTrue();
    expect(component.successMessage).toBe('');
    expect(component.errorCorreo).toBe('');
  });

  // Prueba 6: con datos validos (nombre, correo, contraseña y rol), registra al usuario
  // en AuthService, muestra el mensaje de exito y persiste el correo en localStorage.
  it('deberia registrar un usuario valido y mostrar mensaje de exito', () => {
    component.registerForm.setValue({
      nombre: 'Usuario Test',
      correo: 'usuario@test.com',
      password: 'Demo123!',
      confirmar: 'Demo123!',
      rol: 'cliente',
    });

    component.submit();

    expect(component.successMessage).toBe('Registro exitoso. Ahora puedes iniciar sesión.');
    expect(authService.correoRegistrado('usuario@test.com')).toBeTrue();
  });
});
