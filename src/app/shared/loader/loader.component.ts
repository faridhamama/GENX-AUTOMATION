import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  template: `
    <div class="loader" [class]="'size-' + size()">
      <div class="loader-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      @if (label()) {
        <span class="loader-label">{{ label() }}</span>
      }
    </div>
  `,
  styles: [`
    .loader {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .loader-dots {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--color-primary);
      animation: dot-bounce 1.4s ease-in-out infinite both;
    }

    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }

    /* Size variants */
    .size-sm .dot { width: 6px; height: 6px; gap: 4px; }
    .size-md .dot { width: 10px; height: 10px; gap: 6px; }
    .size-lg .dot { width: 14px; height: 14px; gap: 8px; }
    .size-xl .dot { width: 18px; height: 18px; gap: 10px; }

    .loader-label {
      font-family: var(--font-label);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--color-on-surface-variant);
    }

    @keyframes dot-bounce {
      0%, 80%, 100% {
        transform: scale(0.6);
        opacity: 0.4;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  label = input<string>('');
}