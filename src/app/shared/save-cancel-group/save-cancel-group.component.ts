import { ChangeDetectionStrategy, Component, output, input } from '@angular/core';

@Component({
  selector: 'app-save-cancel-group',
  standalone: true,
  imports: [],
  template: `
    <div class="flex gap-2">
      <button
        type="submit"
        (click)="save.emit()"
        class="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 font-label font-bold uppercase tracking-widest text-[10px] hover:bg-on-primary-fixed-variant transition-colors rounded-sm cursor-pointer"
      >
        <span class="material-symbols-outlined text-base" aria-hidden="true">check</span>
        {{ saveLabel() }}
      </button>
      <button
        type="button"
        (click)="cancel.emit()"
        class="bg-surface-container text-on-surface px-4 py-2 font-label font-bold uppercase tracking-widest text-[10px] hover:bg-surface-container-high transition-colors rounded-sm cursor-pointer"
      >
        {{ cancelLabel() }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveCancelGroupComponent {
  saveLabel = input<string>('Enregistrer');
  cancelLabel = input<string>('Annuler');
  save = output<void>();
  cancel = output<void>();
}