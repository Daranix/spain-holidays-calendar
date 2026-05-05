import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RESPONSE } from '@/shared/di/tokens';

@Component({
    selector: 'app-error',
    standalone: true,
    imports: [RouterLink],
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
