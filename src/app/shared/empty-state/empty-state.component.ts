import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [],
  template: `
    <div class="text-center py-8">
      <span class="material-symbols-outlined text-4xl text-outline mb-3 block" aria-hidden="true">
        {{ icon() }}
      </span>
      <p class="text-sm text-on-surface-variant">{{ message() }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  icon = input<string>('inbox');
  message = input<string>('Aucun élément');
}