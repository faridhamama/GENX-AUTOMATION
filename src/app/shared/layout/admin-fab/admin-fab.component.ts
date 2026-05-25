import { Component, ChangeDetectionStrategy, output } from '@angular/core';

@Component({
  selector: 'app-admin-fab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-fab.component.html',
  styleUrl: './admin-fab.component.scss',
})
export class AdminFabComponent {
  readonly activate = output<void>();

  onClick(): void {
    this.activate.emit();
  }
}
