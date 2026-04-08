import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { addDays, lastDayOfMonth, subDays } from 'date-fns';
import { meses, TipoFestividad, HOLIDAY_TYPES_CONFIG } from '@/shared/models/common';
import { DiaFestivo } from '@/shared/models/output/find-festivos-provincia.response';
import { HolidayDescriptionsService, HolidayDescription } from '@/app/services/holiday-descriptions.service';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { HolidayDetailComponent } from './holiday-detail/holiday-detail.component';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule
    ],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  private readonly holidayDescriptions = inject(HolidayDescriptionsService);
  private readonly dialog = inject(Dialog);

  readonly festivos = input.required<Array<DiaFestivo>>();
  readonly year = input.required<number>();
  readonly month = input.required<number>();
  
  readonly festivosGroupByDay = computed(() => {
    const entries: Array<[number, { tipo: TipoFestividad; nombre: string }]> = this.festivos().map(({ dia, nameFestividad, festividad }) => [dia, { tipo: festividad as TipoFestividad, nombre: nameFestividad }]);
    return Object.fromEntries(entries) as Record<number, { tipo: TipoFestividad, nombre: string }>;
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
    const tipo = this.festivosGroupByDay()[dia]?.tipo;
    return tipo ? `f${tipo}` : '';
  }

  getDate(dia: number) {
    return new Date(this.year(), this.month(), dia);
  }

  getDescription(festivoName: string): HolidayDescription | null {
    return this.holidayDescriptions.getDescription(festivoName);
  }

  hasDescription(festivoName: string): boolean {
    return this.holidayDescriptions.hasDescription(festivoName);
  }

  openHolidayDetail(festivoName: string, tipo: TipoFestividad) {
    let holiday = this.holidayDescriptions.getDescription(festivoName);
    
    // Fallback if no detailed description is found
    if (!holiday) {
      holiday = {
        name: festivoName,
        description: 'Día festivo celebrado en esta localidad.',
        origin: 'La información detallada sobre el origen de este festivo local no está disponible actualmente.',
        traditions: 'Las tradiciones varían según el municipio y la festividad específica.'
      };
    }

    this.dialog.open(HolidayDetailComponent, {
      data: { holiday, type: tipo },
      maxWidth: 'min(500px, 95vw)',
      panelClass: 'holiday-dialog-panel'
    });
  }

  getHolidayTypeLabel(tipo: string): string {
    return HOLIDAY_TYPES_CONFIG[tipo as TipoFestividad]?.label || tipo;
  }

}
