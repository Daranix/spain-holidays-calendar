import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-calculadora-puentes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calculadora-puentes.component.html',
  styleUrl: './calculadora-puentes.component.scss'
})
export class CalculadoraPuentesComponent {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    diasDisponibles: [3, [Validators.required, Validators.min(1), Validators.max(30)]],
    provinciaSeleccionada: ['madrid', Validators.required]
  });

  resultado = signal<string | null>(null);

  calcular() {
    if (this.form.invalid) return;

    const { diasDisponibles, provinciaSeleccionada } = this.form.value;

    // This is a simplified static logic for demonstration.
    // In a real app it would fetch the specific province data and calculate real gaps.
    if (diasDisponibles! >= 2 && provinciaSeleccionada === 'madrid') {
      this.resultado.set('Si pides el 30 de Abril y el 3 de Mayo, unirás el fin de semana con el festivo del 1 de Mayo y el 2 de Mayo (Día de la Comunidad). ¡Gastarás 2 días de vacaciones y conseguirás 5 días seguidos libres!');
    } else if (diasDisponibles! >= 1 && provinciaSeleccionada === 'barcelona') {
      this.resultado.set('Si te pides libre el día siguiente a La Mercè (24 de septiembre), podrás empalmar 4 días seguidos usando solo 1 día de tus vacaciones.');
    } else {
      this.resultado.set(`Gastando ${diasDisponibles} días en la semana del puente de diciembre (6 y 8 de diciembre), podrías llegar a disfrutar de casi una semana completa de descanso.`);
    }
  }
}
