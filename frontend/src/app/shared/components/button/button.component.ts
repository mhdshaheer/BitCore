import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="loading || disabled"
      (click)="onClick.emit($event)"
      [class]="'btn-' + variant + ' w-full flex items-center justify-center gap-2'"
    >
      <span *ngIf="loading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() type: 'submit' | 'button' = 'button';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() loading = false;
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<MouseEvent>();
}
