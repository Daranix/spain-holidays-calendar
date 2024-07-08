import { RESPONSE } from '@/shared/di/tokens';
import { Component, inject, input } from '@angular/core';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  
  readonly statusCode = input(404);
  private readonly response = inject(RESPONSE, { optional: true });

  constructor() {
    this.response?.status(this.statusCode())
  }

  goBack() {
    history.back();
  }

}
