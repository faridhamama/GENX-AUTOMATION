import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [],
  template: `
    <div>
      <label class="block font-label text-[10px] font-bold tracking-[0.15em] text-outline uppercase mb-1">
        {{ label() }}
        @if (required()) {
          <span class="text-error" aria-hidden="true">*</span>
          <span class="sr-only">(obligatoire)</span>
        }
      </label>
      @if (helper()) {
        <p class="text-xs text-on-surface-variant mb-1.5">{{ helper() }}</p>
      }
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  label = input.required<string>();
  helper = input<string>('');
  required = input<boolean>(false);
}