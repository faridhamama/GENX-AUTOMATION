import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-icon-select',
  standalone: true,
  imports: [],
  template: `
    <div class="space-y-3">
      <div class="text-xs text-on-surface-variant font-label uppercase tracking-widest">
        Icône sélectionnée
      </div>
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-3xl text-primary" aria-hidden="true">{{ value() || 'help' }}</span>
        <span class="text-sm text-on-surface">{{ value() || 'Aucune sélectionnée' }}</span>
      </div>
      <button
        type="button"
        (click)="toggleOpen()"
        class="flex items-center gap-1.5 px-3 py-2 bg-surface border border-outline text-sm text-on-surface hover:border-primary transition-colors rounded cursor-pointer"
      >
        <span class="material-symbols-outlined text-base" aria-hidden="true"> {{ open() ? 'expand_less' : 'expand_more' }}</span>
        {{ open() ? 'Fermer' : 'Choisir une icône' }}
      </button>
      @if (open()) {
        <div class="bg-surface border border-outline rounded p-3">
          <div class="grid grid-cols-6 gap-2">
            @for (icon of icons; track icon) {
              <button
                type="button"
                (click)="selectIcon(icon)"
                [class]="value() === icon
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-low text-on-surface border-outline hover:border-primary'
                  + ' border-2 rounded flex items-center justify-center w-10 h-10 transition-colors cursor-pointer'"
                [title]="icon"
              >
                <span class="material-symbols-outlined text-lg" aria-hidden="true">{{ icon }}</span>
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSelectComponent {
  value = input<string>('');
  valueChange = output<string>();

  readonly open = signal(false);

  readonly icons = [
    'engineering',
    'handshake',
    'workspace_premium',
    'precision_manufacturing',
    'monitoring',
    'support_agent',
    'verified',
    'security',
    'bolt',
    'electric_bolt',
    'power',
    'science',
    'auto_graph',
    'stars',
    'military_tech',
    'schedule',
    'access_time',
    'domain',
    'business',
    'location_on',
    'campaign',
    'mail',
    'analytics',
    'bar_chart',
    'star',
    'grade',
    'check_circle',
    'person',
    'groups',
    'directory',
    'description',
    'image',
    'photo',
    'cancel',
    'error',
    'warning',
    'info',
  ] as const;

  protected toggleOpen(): void {
    this.open.update((v) => !v);
  }

  protected selectIcon(icon: string): void {
    this.valueChange.emit(icon);
    this.open.set(false);
  }
}