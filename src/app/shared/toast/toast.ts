import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="fixed top-20 sm:top-24 right-4 sm:right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-sm shadow-lg pointer-events-auto max-w-sm w-[calc(100vw-2rem)] sm:w-auto border-l-4"
          [class.bg-error-container]="toast.type === 'error'"
          [class.text-on-error-container]="toast.type === 'error'"
          [class.border-l-error]="toast.type === 'error'"
          [class.bg-surface-container-lowest]="toast.type === 'success'"
          [class.text-on-surface]="toast.type === 'success'"
          [class.border-l-primary]="toast.type === 'success'"
          role="alert"
          aria-live="assertive"
        >
          <span class="material-symbols-outlined text-base sm:text-lg shrink-0" aria-hidden="true">
            {{ toast.type === 'error' ? 'error' : 'check_circle' }}
          </span>
          <span class="text-[13px] sm:text-sm font-label leading-snug">{{ toast.message }}</span>
          <button
            (click)="toastService.dismiss(toast.id)"
            class="material-symbols-outlined text-sm sm:text-base shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-auto"
            aria-label="Fermer"
          >close</button>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  readonly toastService = inject(ToastService);
}
