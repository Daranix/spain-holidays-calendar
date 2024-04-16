import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { addDays, lastDayOfMonth, subDays } from 'date-fns';
import { meses } from '@/shared/models/common';
import { DiaFestivo } from '@/shared/models/output/find-festivos-provincia.response';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  readonly festivos = input.required<Array<DiaFestivo>>();
  readonly year = input.required<number>();
  readonly month = input.required<number>();
  
  readonly festivosGroupByDay = computed(() => {
    const festividad: Array<[number, { tipo: string; nombre: string }]> = this.festivos().map(({ dia, nameFestividad, festividad }) => [dia, { tipo: festividad, nombre: nameFestividad }]);
    const result = Object.fromEntries(festividad) satisfies Record<number, { tipo: string, nombre: string }>;
    return result;
  });

  readonly monthName = computed(() => meses[this.month()-1]);

  private readonly startDate = computed(() => new Date(this.year(), this.month()-1));
  
  readonly daysToFillStartWeek = computed(() => {
    let baseDate = this.startDate();
    const dateFill: Array<Date> = [];
    while(baseDate.getDay() !== 1) {
      baseDate = subDays(baseDate, 1);
      dateFill.push(baseDate)
    }
    return dateFill.reverse();
  });

  readonly daysInMonth = computed(
    () => new Array(lastDayOfMonth(this.startDate()).getDate())
                .fill(null)
                .map((v, i) => new Date(this.year(), this.month() - 1, i+1))
  );

  readonly daysToFillEnd = computed(() => {
    
    const daysNumber = (7*6) - (this.daysToFillStartWeek().length + this.daysInMonth().length)
    let baseDate = lastDayOfMonth(this.startDate());
    const dates: Array<Date> = [];
    
    for(let i = 0; i < daysNumber; i++) {
      baseDate = addDays(baseDate, 1);
      dates.push(baseDate);
    }
    
    return dates;

  });


  applyFestividadStyle(dia: number): string {
    const tipo = this.festivosGroupByDay()?.[dia.toString()]?.tipo;
    return tipo ? `f${tipo}` : '';
  }

  getDate(dia: number) {
    return new Date(this.year(), this.month(), dia);
  }


}
