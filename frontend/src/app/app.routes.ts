import { Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { NuevoComponent } from './nuevo/nuevo.component';
import { EditarComponent } from './editar/editar.component';
import { LoginComponent } from './login/login.component';  // ← agrégalo aquí
import { LayoutComponent } from './layout/layout.component';
import { InicioComponent } from './inicio/inicio.component';
import { CarritoComponent } from './carrito/carrito.component';
import { RegistroComponent } from './registro/registro.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'registro',  // 👈 AÑADE ESTA RUTA AQUÍ
    component: RegistroComponent
  },

  {
    path: '',
    component: LayoutComponent,  // Este sí tiene el navbar
    children: [
      { path: 'inicio', component: InicioComponent }, // ← NUEVO
      { path: 'listar-libros', component: ListarComponent },
      { path: 'nuevo-libro', component: NuevoComponent },
      { path: 'editar-libro', component: EditarComponent },
      { path: 'categoria/:genero', component: ListarComponent },
      { path: 'carrito', component: CarritoComponent }

    ]
  },
];
