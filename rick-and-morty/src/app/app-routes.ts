import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'lista-personajes', loadComponent: () => import('./components/lista-personajes/lista-personajes.component').then(m => m.ListaPersonajesComponent) },
  { path: 'detalles-personajes/:id', loadComponent: () => import('./components/detalles-personajes/detalles-personajes.component').then(m => m.DetallesPersonajesComponent) },
];
