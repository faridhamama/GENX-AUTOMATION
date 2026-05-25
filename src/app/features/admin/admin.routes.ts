import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    redirectTo: 'emails',
    pathMatch: 'full',
  },
  {
    path: 'emails',
    loadComponent: () => import('./email-editor/email-editor.component').then((m) => m.EmailEditorComponent),
  },
];