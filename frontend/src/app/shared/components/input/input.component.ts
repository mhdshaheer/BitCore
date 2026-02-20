import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-1">
      <label *ngIf="label" class="block text-sm font-medium text-slate-700">{{ label }}</label>
      <div class="relative">
        <input
          [type]="type"
          [placeholder]="placeholder"
          [formControl]="control"
          class="input-field"
          [class.border-red-500]="control.invalid && control.touched"
        />
      </div>
      <p *ngIf="control.invalid && control.touched" class="text-xs text-red-500 mt-1">
        {{ errorMessage }}
      </p>
    </div>
  `
})
export class InputComponent {
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() control = new FormControl();
  @Input() errorMessage = 'Invalid field';
}
