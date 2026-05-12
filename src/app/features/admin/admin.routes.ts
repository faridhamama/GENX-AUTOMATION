import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'emails',
    loadComponent: () => import('./email-editor/email-editor.component').then((m) => m.EmailEditorComponent),
  },
  {
    path: 'company',
    loadComponent: () => import('./company-editor/company-editor.component').then((m) => m.CompanyEditorComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./home-editor/home-editor.component').then((m) => m.HomeEditorComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./company-editor/company-editor.component').then((m) => m.CompanyEditorComponent),
  },
  {
    path: 'references',
    loadComponent: () => import('./references-editor/references-editor.component').then((m) => m.ReferencesEditorComponent),
  },
  {
    path: 'services',
    loadComponent: () => import('./services-editor/services-editor.component').then((m) => m.ServicesEditorComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./about-editor/about-editor.component').then((m) => m.AboutEditorComponent),
  },
  {
    path: 'contact-content',
    loadComponent: () => import('./contact-editor/contact-editor.component').then((m) => m.ContactEditorComponent),
  },
  {
    path: 'homepage-hero',
    loadComponent: () => import('./home-editor/home-editor.component').then((m) => m.HomeEditorComponent),
  },
];