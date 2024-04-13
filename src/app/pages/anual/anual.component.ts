import { CalendarComponent } from '@/app/calendar/calendar.component';
import { RestClientService } from '@/app/services/rest-client/rest-client.service';
import { TopNavbarService } from '@/app/services/top-navbar/top-navbar.service';
import { LOADING_INITIAL_VALUE, loading } from '@/app/utils/rx-pipes';
import { meses } from '@/shared/models/common';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { map, merge, switchMap } from 'rxjs';

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
  readonly year = toSignal(this.activeRouter.paramMap.pipe(map((v) => Number.parseInt(v.get('year')!))), { initialValue: Number.parseInt(this.activeRouter.snapshot.paramMap.get('year')!) })
  readonly provincia = toSignal(this.activeRouter.paramMap.pipe(map((v) =>v.get('provincia')!)), { initialValue: this.activeRouter.snapshot.paramMap.get('provincia')! })
  readonly festivos$ = merge(
    toObservable(this.year),
    toObservable(this.provincia)
  ).pipe(switchMap(() => this.restClient.findFestivosProvincia({ provincia: this.provincia(), year: this.year() })))
  readonly festivos = toSignal(
    this.festivos$
  );

  readonly meses = meses;

  constructor() {
    this.topNavbarService.title.set(`Calendario Festivos ${this.titleCasePipe.transform(this.provincia())} - ${this.year()}`)
    /*effect(() => {
      this.topNavbarService.title.set(`Calendario Festivos ${this.titleCasePipe.transform(this.provincia())} - ${this.year()}`)
    }, {  });*/
  }

  getFestivos(idx: number) {
    return this.festivos()?.[meses[idx]] || [];
  }
}
