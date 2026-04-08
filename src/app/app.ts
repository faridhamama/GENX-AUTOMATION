import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { Toast } from './shared/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Toast],
  template: `
    <app-navbar />
    <router-outlet />
    <app-footer />
    <app-toast />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // Injecting AuthService triggers its constructor on startup,
  // restoring the session from localStorage before any route resolves.
  private readonly _auth = inject(AuthService);
}
