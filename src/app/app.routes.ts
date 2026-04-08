import { Routes } from '@angular/router';

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
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/dashboard/dashboard').then((m) => m.Dashboard),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
