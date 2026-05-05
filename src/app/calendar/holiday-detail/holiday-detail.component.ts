import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HolidayDescription } from '../../services/holiday-descriptions.service';
import { TipoFestividad, HOLIDAY_TYPES_CONFIG } from '@/shared/models/common';

@Component({
  selector: 'app-holiday-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-[32px] shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
      <!-- Header -->
      <div class="relative p-10 text-white" [class]="getHeaderClass()">
        <button 
          (click)="dialogRef.close()"
          class="absolute top-6 right-6 p-2.5 hover:bg-black/10 rounded-full transition-all active:scale-90"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="flex items-center gap-3 mb-4">
          <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] bg-white/20 backdrop-blur-sm shadow-sm border border-white/10">
            {{ getHolidayLabel() }}
          </span>
        </div>
        <h2 class="text-4xl font-black leading-none drop-shadow-md">{{ data.holiday.name }}</h2>
      </div>

      <!-- Content -->
      <div class="p-10 space-y-10">
        <section class="relative">
          <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            ¿Qué se celebra?
          </h3>
          <p class="text-gray-800 leading-relaxed text-xl font-medium">{{ data.holiday.description }}</p>
        </section>

        <!-- Google Search Fallback -->
        <section *ngIf="isFallbackDescription()" class="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-start gap-4 animate-in slide-in-from-bottom-2 duration-700">
            <div class="p-3 bg-white rounded-2xl shadow-sm border border-amber-200 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <div>
                <h4 class="text-sm font-bold text-amber-900 mb-1">¿Quieres saber más?</h4>
                <p class="text-xs text-amber-700 mb-4 leading-relaxed line-clamp-2">No tenemos todos los detalles específicos para este municipio, pero puedes consultarlo en un clic.</p>
                <a 
                    [href]="getGoogleSearchUrl()" 
                    target="_blank"
                    class="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl text-xs font-bold text-amber-900 shadow-sm border border-amber-200 hover:bg-amber-100 hover:shadow-md transition-all active:scale-95"
                >
                    Buscar "{{ data.holiday.name }}" en Google
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10" *ngIf="!isFallbackDescription()">
          <section *ngIf="data.holiday.origin" class="animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
            <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Origen e Historia</h3>
            <p class="text-gray-600 text-sm leading-relaxed font-normal">{{ data.holiday.origin }}</p>
          </section>

          <section *ngIf="data.holiday.traditions" class="animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Tradiciones</h3>
            <p class="text-gray-600 text-sm leading-relaxed font-normal">{{ data.holiday.traditions }}</p>
          </section>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50/50 p-8 flex justify-center border-t border-gray-100">
        <button 
          (click)="dialogRef.close()"
          class="w-full max-w-xs px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white bg-gray-900 hover:bg-gray-800 shadow-xl shadow-gray-200 transition-all hover:-translate-y-1 active:scale-95 active:translate-y-0"
        >
          Entendido
        </button>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .holiday-dialog-panel {
      width: 100%;
      display: flex;
      justify-content: center;
      animation: modal-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes modal-pop {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    :host {
      display: block;
      perspective: 1000px;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class HolidayDetailComponent {
  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: { holiday: HolidayDescription, type: TipoFestividad }
  ) {}

  getHeaderClass(): string {
    switch (this.data.type) {
      case 'nacional': return 'bg-gradient-to-br from-green-500 to-green-700 shadow-lg shadow-green-100';
      case 'autonomico': return 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-100';
      case 'local': return 'bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg shadow-rose-100';
      default: return 'bg-gray-800';
    }
  }

  getHolidayLabel(): string {
    return HOLIDAY_TYPES_CONFIG[this.data.type]?.label || 'Festivo';
  }

  isFallbackDescription(): boolean {
    return !this.data.holiday.origin && !this.data.holiday.traditions && this.data.holiday.description.includes('celebrado en esta localidad');
  }

  getGoogleSearchUrl(): string {
    const query = encodeURIComponent(`festividad ${this.data.holiday.name} origen historia tradiciones españa`);
    return `https://www.google.com/search?q=${query}`;
  }
}
