import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services').then((m) => m.Services),
  },
  {
    path: 'references',
    loadComponent: () => import('./pages/references/references').then((m) => m.References),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'admin',
    loadComponent: () => import('./shared/layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'company',
        loadComponent: () => import('./pages/admin/company/company').then((m) => m.CompanyAdmin),
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/admin/home/home-admin').then((m) => m.AdminHome),
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/admin/contact/contact-admin').then((m) => m.AdminContact),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
