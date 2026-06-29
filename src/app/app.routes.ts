import { Routes } from '@angular/router';

import { adminGuard, authGuard, guestGuard } from './core/guards/auth.guard';
import { Admin } from './admin/admin';
import { Cart } from './cart/cart';
import { CategoryProducts } from './category-products/category-products';
import { Home } from './home/home';
import { Login } from './login/login';
import { Profile } from './profile/profile';
import { Recover } from './recover/recover';
import { Register } from './register/register';

/** Rutas principales de Deep Dark Deco con guards y clases de fondo por pagina. */
export const routes: Routes = [
  { path: '', component: Home, canActivate: [authGuard] },
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
    data: { bodyClass: 'category-page auth-page-body' },
  },
  {
    path: 'register',
    component: Register,
    data: { bodyClass: 'category-page auth-page-body' },
  },
  {
    path: 'recover',
    component: Recover,
    canActivate: [guestGuard],
    data: { bodyClass: 'category-page auth-page-body' },
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
    data: { bodyClass: 'category-page' },
  },
  {
    path: 'cart',
    component: Cart,
    canActivate: [authGuard],
    data: { bodyClass: 'category-page cart-page' },
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [adminGuard],
    data: { bodyClass: 'category-page admin-page' },
  },
  { path: 'products', redirectTo: 'products/salon', pathMatch: 'full' },
  {
    path: 'products/:slug',
    component: CategoryProducts,
    canActivate: [authGuard],
    data: { bodyClass: 'category-page' },
  },
  { path: '**', redirectTo: '' },
];
