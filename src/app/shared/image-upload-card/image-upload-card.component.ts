import { ChangeDetectionStrategy, Component, inject, output, input, signal, effect } from '@angular/core';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-image-upload-card',
  standalone: true,
  imports: [],
  template: `
    @if (isEditing()) {
      <div class="space-y-4">
        <div>
          <label class="block font-label text-[10px] font-bold tracking-[0.15em] text-outline uppercase mb-1">Fichier image</label>
          <input
            (change)="onFileSelected($event)"
            type="file"
            accept="image/*"
            class="w-full text-xs text-on-surface-variant file:mr-3 file:py-1.5 file:px-4 file:rounded-sm file:border-0 file:bg-surface-container file:text-on-surface file:font-label file:font-bold file:tracking-widest file:text-[10px] file:hover:file:bg-surface-container-high cursor-pointer"
          />
          @if (selectedFile()) {
            <p class="text-xs text-on-surface-variant mt-1">Sélectionné: {{ selectedFile()?.name }}</p>
          }
        </div>
        <div>
          <label class="block font-label text-[10px] font-bold tracking-[0.15em] text-outline uppercase mb-1">Texte alternatif</label>
          <input
            [value]="editAltText()"
            (input)="onAltTextInput($event)"
            type="text"
            placeholder="Description de l'image"
            class="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary transition-colors py-2 px-0 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/40"
          />
        </div>
        <div class="flex gap-2">
          <button
            (click)="upload.emit({ file: selectedFile(), altText: editAltText() })"
            type="button"
            [disabled]="!selectedFile()"
            class="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 font-label font-bold uppercase tracking-widest text-[10px] hover:bg-on-primary-fixed-variant transition-colors rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="material-symbols-outlined text-base" aria-hidden="true">cloud_upload</span>
            Upload
          </button>
          <button
            (click)="onCancel()"
            type="button"
            class="bg-surface-container text-on-surface px-4 py-2 font-label font-bold uppercase tracking-widest text-[10px] hover:bg-surface-container-high transition-colors rounded-sm cursor-pointer"
          >
            Annuler
          </button>
        </div>
      </div>
    } @else {
      <div class="flex items-start gap-4">
        <div class="shrink-0">
          @if (imageUrl()) {
            <img [src]="imageUrl()" [alt]="altText() || imageKey()" class="h-20 w-20 object-cover rounded border border-secondary/30" />
          } @else {
            <div class="h-20 w-20 rounded border border-dashed border-secondary/30 flex items-center justify-center">
              <span class="material-symbols-outlined text-secondary/50 text-2xl" aria-hidden="true">image_not_supported</span>
            </div>
          }
        </div>
        <div class="flex-1 min-w-0">
          <span class="font-label text-[10px] font-bold uppercase tracking-widest text-primary">{{ imageKey() }}</span>
          <p class="text-xs text-on-surface-variant mt-1">{{ altText() || 'Pas de texte alternatif' }}</p>
        </div>
        <button
          (click)="edit.emit()"
          type="button"
          class="flex items-center gap-1 text-outline hover:text-primary transition-colors text-xs font-label font-bold uppercase tracking-widest cursor-pointer"
        >
          <span class="material-symbols-outlined text-base" aria-hidden="true">edit</span>
          Modifier
        </button>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadCardComponent {
  private readonly toast = inject(ToastService);

  readonly MAX_SIZE = 5 * 1024 * 1024; // 5MB

  imageKey = input.required<string>();
  imageUrl = input<string>('');
  altText = input<string>('');
  isEditing = input<boolean>(false);

  edit = output<void>();
  cancel = output<void>();
  upload = output<{ file: File | null; altText: string }>();

  readonly selectedFile = signal<File | null>(null);
  readonly editAltText = signal('');

  constructor() {
    effect(() => {
      if (this.isEditing()) {
        this.editAltText.set(this.altText());
      }
    }, { allowSignalWrites: true });
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toast.error('Veuillez sélectionner un fichier image valide');
        return;
      }

      // Validate file size
      if (file.size > this.MAX_SIZE) {
        this.toast.error('Le fichier est trop volumineux (max 5 Mo)');
        return;
      }

      this.selectedFile.set(file);
    }
  }

  protected onCancel(): void {
    this.selectedFile.set(null);
    this.editAltText.set('');
    this.cancel.emit();
  }

  protected onAltTextInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.editAltText.set(target.value ?? '');
  }
}