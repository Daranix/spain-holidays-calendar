import { CalendarComponent } from '@/app/calendar/calendar.component';
import { RestClientService } from '@/app/services/rest-client/rest-client.service';
import { TopNavbarService } from '@/app/services/top-navbar/top-navbar.service';
import { meses } from '@/shared/models/common';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { map, shareReplay, switchMap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-anual',
  standalone: true,
  imports: [
    CalendarComponent,
    CommonModule
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
  private readonly titleService = inject(Title);
  private readonly metadataService = inject(Meta);


  readonly year = toSignal(this.activeRouter.paramMap.pipe(map((v) => Number.parseInt(v.get('year')!))), { initialValue: Number.parseInt(this.activeRouter.snapshot.paramMap.get('year')!) })
  readonly provincia = toSignal(this.activeRouter.paramMap.pipe(map((v) => v.get('provincia')!.split('-').join(' '))), { initialValue: this.activeRouter.snapshot.paramMap.get('provincia')!.split('-').join(' ') })
  readonly festivos$ = this.activeRouter.params.pipe(
    switchMap(({ year, provincia }) => this.restClient.findFestivosProvincia({ provincia, year })),
    shareReplay(1),
    takeUntilDestroyed()
  );

  readonly festivos = toSignal(
    this.festivos$,
    { initialValue: {} },
  );

  readonly meses = meses;

  constructor() {
    this.topNavbarService.title.set(`Calendario Festivos ${this.titleCasePipe.transform(this.provincia())} - ${this.year()}`);
    this.festivos$.pipe(takeUntilDestroyed()).subscribe(() => {
      const text = `Calendario Festivos ${this.titleCasePipe.transform(this.provincia())} - ${this.year()}`
      this.topNavbarService.title.set(text)
      this.titleService.setTitle(text)
      const description = `Listado de festivos ${this.titleCasePipe.transform(this.provincia())} año ${this.year()}`;
      this.metadataService.updateTag({ property: 'og:description', content: description });
      this.metadataService.updateTag({ name: 'description', content: description })
    });

  }

}
