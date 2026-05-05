import { CalendarComponent } from '@/app/calendar/calendar.component';
import { BreadcrumbComponent } from '@/app/components/breadcrumb/breadcrumb.component';
import { HolidayInfoSectionComponent } from '@/app/calendar/holiday-info-section/holiday-info-section.component';
import { RestClientService } from '@/app/services/rest-client.service';
import { TopNavbarService } from '@/app/services/top-navbar.service';
import { meses } from '@/shared/models/common';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { map, shareReplay, switchMap } from 'rxjs';
import { LOADING_INITIAL_VALUE, loading } from '@/app/utils/rx-pipes';
import { SpinnerComponent } from '@/app/spinner/spinner.component';
import { updateCanonnicalUrl } from '@/app/utils/common';
import { MetadataService } from '@/app/services/metadata.service';
import { getProvinceDescription } from '@/app/utils/province-info';

@Component({
    selector: 'app-anual',
    imports: [
        CalendarComponent,
        BreadcrumbComponent,
        CommonModule,
        SpinnerComponent,
        HolidayInfoSectionComponent,
        RouterLink
    ],
    providers: [
        TitleCasePipe
    ],
    templateUrl: './anual.component.html',
    styleUrl: './anual.component.scss'
})
export class AnualComponent {

  readonly isNative = Capacitor.isNativePlatform();


  protected readonly topNavbarService = inject(TopNavbarService);
  protected readonly activeRouter = inject(ActivatedRoute);
  protected readonly restClient = inject(RestClientService);
  protected readonly titleCasePipe = inject(TitleCasePipe);
  protected readonly metadataService = inject(MetadataService);


  readonly year = toSignal(this.activeRouter.paramMap.pipe(map((v) => Number.parseInt(v.get('year')!))), { initialValue: Number.parseInt(this.activeRouter.snapshot.paramMap.get('year')!) })
  readonly provincia = toSignal(this.activeRouter.paramMap.pipe(map((v) => v.get('provincia')!.split('-').join(' '))), { initialValue: this.activeRouter.snapshot.paramMap.get('provincia')!.split('-').join(' ') })
  readonly festivos$ = this.activeRouter.params.pipe(
    switchMap(({ year, provincia }) => this.restClient.findFestivosProvincia({ provincia, year }).pipe(loading())),
    shareReplay(1),
    takeUntilDestroyed()
  );

  readonly festivos = toSignal(
    this.festivos$,
    { initialValue: LOADING_INITIAL_VALUE },
  );

  readonly meses = meses;

  readonly holidaySummary = computed(() => {
    const data = this.festivos().data;
    if (!data) return null;

    let total = 0;
    const byType: Record<string, number> = { nacional: 0, autonomico: 0, local: 0 };
    
    for (const month of Object.values(data)) {
      total += month.length;
      for (const h of month) {
        const tipo = h.festividad;
        if (byType[tipo] !== undefined) {
          byType[tipo]++;
        }
      }
    }

    return {
      total,
      nacional: byType['nacional'],
      autonomico: byType['autonomico'],
      local: byType['local']
    };
  });

  readonly provinciasResource = toSignal(this.restClient.getProvincias());

  readonly provinceDescription = computed(() => getProvinceDescription(this.provincia()));

  constructor() {
    updateCanonnicalUrl();
    this.updateMetadata();
    this.festivos$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.updateMetadata();
    });
  }

  updateMetadata() {
    const provincia = this.titleCasePipe.transform(this.provincia());
    const year = this.year();
    const title = `Calendario Festivos ${provincia} - ${year}`
    this.topNavbarService.title.set(title);
    
    const summary = this.holidaySummary();
    const totalMsg = summary ? `total de ${summary.total} días festivos` : 'listado de festivos';
    const description = `Calendario laboral completo de ${provincia} para el año ${year}. Consulta el ${totalMsg}, incluyendo Festivo Nacional, Festivo Autonómico y Festivo Local para planificar tus vacaciones y puentes.`;
    
    // Solo indexar 2024, 2025 y 2026
    const noindex = year < 2024 || year > 2026;

    this.metadataService.updateMetadata({
      title,
      description,
      updateCanonical: true,
      noindex
    });
  }

}
