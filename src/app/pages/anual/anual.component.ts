import { CalendarComponent } from '@/app/calendar/calendar.component';
import { RestClientService } from '@/app/services/rest-client.service';
import { TopNavbarService } from '@/app/services/top-navbar.service';
import { meses } from '@/shared/models/common';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { map, shareReplay, switchMap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { LOADING_INITIAL_VALUE, loading } from '@/app/utils/rx-pipes';
import { SpinnerComponent } from '@/app/spinner/spinner.component';
import { updateCanonnicalUrl } from '@/app/utils/common';
import { MetadataService } from '@/app/services/metadata.service';

@Component({
    selector: 'app-anual',
    imports: [
        CalendarComponent,
        CommonModule,
        SpinnerComponent
    ],
    providers: [
        TitleCasePipe
    ],
    templateUrl: './anual.component.html',
    styleUrl: './anual.component.scss'
})
export class AnualComponent {

  readonly isNative = Capacitor.isNativePlatform();


  private readonly topNavbarService = inject(TopNavbarService);
  private readonly activeRouter = inject(ActivatedRoute);
  private readonly restClient = inject(RestClientService);
  private readonly titleCasePipe = inject(TitleCasePipe);
  private readonly metadataService = inject(MetadataService);


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
    const byType: Record<string, number> = { nacional: 0, regional: 0, provincial: 0, local: 0 };
    
    for (const month of Object.values(data)) {
      total += month.length;
      for (const h of month) {
        byType[h.festividad] = (byType[h.festividad] || 0) + 1;
      }
    }

    return {
      total,
      nacional: byType['nacional'],
      regional: byType['regional'],
      provincial: byType['provincial'],
      local: byType['local']
    };
  });

  constructor() {
    updateCanonnicalUrl();
    this.updateMetadata();
    this.festivos$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.updateMetadata();
    });

  }

  updateMetadata() {
    const title = `Calendario Festivos ${this.titleCasePipe.transform(this.provincia())} - ${this.year()}`
    this.topNavbarService.title.set(title);
    const description = `Listado de festivos ${this.titleCasePipe.transform(this.provincia())} año ${this.year()}`;
    this.metadataService.updateMetadata({
      title,
      description,
      updateCanonical: true
    });
  }

}
