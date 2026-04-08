import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'error' | 'success';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 0;

  private show(message: string, type: Toast['type']): void {
    const id = ++this.nextId;
    this.toasts.update((t) => [...t, { id, message, type }]);
    setTimeout(() => this.dismiss(id), 4000);
  }

  error(message = 'Une erreur est survenue. Veuillez réessayer plus tard.'): void {
    this.show(message, 'error');
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  dismiss(id: number): void {
    this.toasts.update((t) => t.filter((toast) => toast.id !== id));
  }
}
