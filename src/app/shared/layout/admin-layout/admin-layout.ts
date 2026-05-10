import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Navbar, RouterLink, RouterLinkActive],
  template: `
    <app-navbar />
    <div class="flex min-h-[calc(100vh-64px)]">
      <!-- Sidebar -->
      <aside class="w-56 bg-surface border-r border-outline-variant shrink-0 hidden md:block">
        <nav class="p-4 flex flex-col gap-1">
          <a routerLink="/admin" routerLinkActive="bg-surface-container-high" class="px-3 py-2 rounded text-sm text-on-surface hover:bg-surface-container-low transition-colors">
            Tableau de bord
          </a>
          <div class="mt-4">
            <div class="px-3 py-2 font-label text-[10px] uppercase tracking-widest text-outline">Entreprise</div>
            <a routerLink="/admin/company" routerLinkActive="bg-surface-container-high" class="pl-6 pr-3 py-2 rounded text-sm text-on-surface hover:bg-surface-container-low transition-colors block">
              À propos
            </a>
            <a routerLink="/admin/company/contact" routerLinkActive="bg-surface-container-high" class="pl-6 pr-3 py-2 rounded text-sm text-on-surface hover:bg-surface-container-low transition-colors block">
              Contact
            </a>
          </div>
        </nav>
      </aside>
      <!-- Main content -->
      <main class="flex-1 p-6">
        <router-outlet />
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayout {}
