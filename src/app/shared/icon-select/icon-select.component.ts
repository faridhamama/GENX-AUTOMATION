import { ChangeDetectionStrategy, Component, output, input } from '@angular/core';

@Component({
  selector: 'app-icon-select',
  standalone: true,
  imports: [],
  template: `
    <div class="relative">
      <select
        [value]="value()"
        (change)="onSelect($event)"
        class="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary transition-colors py-2.5 px-1 text-sm text-on-surface outline-none appearance-none cursor-pointer rounded-t-sm"
      >
        <option value="" disabled>Sélectionner une icône</option>
        @for (icon of icons; track icon) {
          <option [value]="icon">{{ icon }}</option>
        }
      </select>
      <span
        class="material-symbols-outlined absolute right-1 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none"
        aria-hidden="true"
      >expand_more</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSelectComponent {
  value = input<string>('');
  valueChange = output<string>();

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

  protected onSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.valueChange.emit(select.value);
  }
}