import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-section-card',
  standalone: true,
  imports: [],
  template: `
    <section class="bg-surface border border-outline-variant rounded-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-outline-variant bg-surface-container-low"
           [class]="accentClass()">
        <div class="flex items-center gap-2 mb-1">
          <span class="material-symbols-outlined text-primary shrink-0" aria-hidden="true">{{ icon() }}</span>
          <h2 class="font-headline font-bold text-on-surface">{{ title() }}</h2>
        </div>
        @if (description()) {
          <p class="text-xs text-on-surface-variant">{{ description() }}</p>
        }
      </div>
      <div class="p-5">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionCardComponent {
  icon = input<string>('settings');
  title = input.required<string>();
  description = input<string>('');
  accentColor = input<'primary' | 'secondary' | 'tertiary' | 'none'>('primary');

  protected accentClass = computed(() => {
    const map: Record<string, string> = {
      primary: 'border-t-4 border-primary',
      secondary: 'border-t-4 border-secondary',
      tertiary: 'border-t-4 border-tertiary',
      none: '',
    };
    return map[this.accentColor()] ?? map['primary'];
  });
}