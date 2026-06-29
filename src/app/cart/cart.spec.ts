import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CartService } from '../core/services/cart.service';
import { Cart } from './cart';

describe('Cart', () => {
  let component: Cart;
  let fixture: ComponentFixture<Cart>;
  let cartService: CartService;

  // Prepara un carrito limpio antes de cada prueba (sin datos previos en storage).
  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Cart],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Cart);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // Prueba 1: verifica que el componente Cart se instancia correctamente en el entorno de pruebas.
  it('deberia crear el componente del carrito', () => {
    expect(component).toBeTruthy();
  });

  // Prueba 2: si el checkout se envia vacio, el formulario debe marcarse como tocado
  // para mostrar errores al usuario, y no debe mostrarse mensaje de venta exitosa.
  it('deberia marcar el formulario como tocado si el checkout es invalido', () => {
    component.submitCheckout();

    expect(component.checkoutForm.touched).toBeTrue();
    expect(component.checkoutMessage).toBe('');
  });

  // Prueba 3: con productos en el carrito y un formulario de checkout valido,
  // confirma la venta dummy, muestra el mensaje de exito y vacia el carrito.
  it('deberia confirmar la venta cuando el formulario es valido y hay productos', () => {
    cartService.addItem({
      nombre: 'Producto Test',
      precio: '$1.000',
      imagen: 'test.png',
      categoria: 'rincon',
      cantidad: 1,
    });

    component.checkoutForm.setValue({
      checkoutNombre: 'Cliente Test',
      checkoutCorreo: 'cliente@test.com',
      checkoutTelefono: '912345678',
      checkoutDireccion: 'Calle 123',
      checkoutCiudad: 'Santiago',
      checkoutPago: 'tarjeta',
      checkoutNotas: '',
    });

    component.submitCheckout();

    expect(component.checkoutMessage).toContain('Venta dummy registrada correctamente');
    expect(cartService.cartItems().length).toBe(0);
  });
});
