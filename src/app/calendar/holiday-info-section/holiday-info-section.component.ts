import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, effect, Renderer2, DOCUMENT } from '@angular/core';
import { DiaFestivo } from '@/shared/models/output/find-festivos-provincia.response';
import { HolidayDescriptionsService, HolidayDescription } from '@/app/services/holiday-descriptions.service';
import { HOLIDAY_TYPES_CONFIG, TipoFestividad } from '@/shared/models/common';

interface HolidayInfoMapping {
  name: string;
  type: TipoFestividad;
  typeLabel: string;
  info: HolidayDescription;
}

@Component({
  selector: 'app-holiday-info-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="max-w-6xl mx-auto px-6 py-12">
      <div class="mb-10 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4 italic">Significado y Tradición de los Festivos</h2>
        <div class="h-1.5 w-24 bg-indigo-600 mx-auto rounded-full"></div>
        <p class="mt-4 text-gray-600 max-w-2xl mx-auto">
          Descubre la historia y las costumbres detrás de las festividades que celebramos. 
          Una guía completa para entender nuestras tradiciones.
        </p>
      </div>

      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        @for (holiday of uniqueHolidaysWithInfo(); track holiday.name) {
          <article class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-4">
              <span [class]="getBadgeClass(holiday.type)" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {{ holiday.typeLabel }}
              </span>
            </div>
            
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ holiday.name }}</h3>
            
            <div class="space-y-4">
              <div>
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Descripción</h4>
                <p class="text-gray-600 text-sm leading-relaxed">{{ holiday.info.description }}</p>
              </div>
              
              @if (holiday.info.origin) {
                <div>
                  <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Origen</h4>
                  <p class="text-gray-600 text-sm leading-relaxed">{{ holiday.info.origin }}</p>
                </div>
              }
              
              @if (holiday.info.traditions) {
                <div>
                  <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tradiciones</h4>
                  <p class="text-gray-600 text-sm leading-relaxed">{{ holiday.info.traditions }}</p>
                </div>
              }
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .badge-nacional { color: #15803d; background-color: #f0fdf4; border: 1px solid #dcfce7; }
    .badge-autonomico { color: #1d4ed8; background-color: #eff6ff; border: 1px solid #dbeafe; }
    .badge-local { color: #be123c; background-color: #fff1f2; border: 1px solid #ffe4e6; }
  `]
})
export class HolidayInfoSectionComponent {
  private readonly holidayService = inject(HolidayDescriptionsService);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);

  readonly festivos = input.required<Record<string, DiaFestivo[]>>();
  readonly province = input.required<string>();
  readonly year = input.required<number>();

  readonly uniqueHolidaysWithInfo = computed(() => {
    const data = this.festivos();
    if (!data || Object.keys(data).length === 0) return [];

    const uniqueMap = new Map<string, HolidayInfoMapping>();

    Object.values(data).forEach(monthFestivos => {
      monthFestivos.forEach(hf => {
        if (!uniqueMap.has(hf.nameFestividad)) {
          const info = this.holidayService.getDescription(hf.nameFestividad);
          if (info) {
            uniqueMap.set(hf.nameFestividad, {
              name: hf.nameFestividad,
              type: hf.festividad as TipoFestividad,
              typeLabel: HOLIDAY_TYPES_CONFIG[hf.festividad as TipoFestividad]?.label || hf.festividad,
              info: info
            });
          }
        }
      });
    });

    return Array.from(uniqueMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  });

  constructor() {
    // Effect to handle JSON-LD injection when unique holidays change
    effect(() => {
      const holidays = this.uniqueHolidaysWithInfo();
      if (holidays.length > 0) {
        this.updateJsonLd(holidays);
      }
    });
  }

  private updateJsonLd(holidays: HolidayInfoMapping[]) {
    // Remove existing schema if any
    const existingScript = this.document.getElementById('holiday-jsonld');
    if (existingScript) {
      this.renderer.removeChild(this.document.head, existingScript);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': `Festivos en ${this.province()} para el año ${this.year()}`,
      'itemListElement': holidays.map((h, index) => ({
        '@type': 'SpecialAnnouncement',
        'position': index + 1,
        'name': h.name,
        'description': h.info.description,
        'category': h.typeLabel,
        'about': {
          '@type': 'Thing',
          'name': h.name,
          'description': h.info.origin
        }
      }))
    };

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'holiday-jsonld';
    script.text = JSON.stringify(schema);
    this.renderer.appendChild(this.document.head, script);
  }

  getBadgeClass(type: TipoFestividad): string {
    return `badge-${type}`;
  }
}
