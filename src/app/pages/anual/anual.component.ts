import { CalendarComponent } from '@/app/calendar/calendar.component';
import { TRPCClientService } from '@/app/services/trpc-client.service';
import { LOADING_INITIAL_VALUE, loading } from '@/app/utils/rx-pipes';
import { meses } from '@/shared/models/common';
import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, merge, switchMap } from 'rxjs';

@Component({
  selector: 'app-anual',
  standalone: true,
  imports: [
    CalendarComponent,
    CommonModule
  ],
  templateUrl: './anual.component.html',
  styleUrl: './anual.component.scss'
})
export class AnualComponent {

  activeRouter = inject(ActivatedRoute);
  trpcService = inject(TRPCClientService);
  year = toSignal(this.activeRouter.paramMap.pipe(map((v) => Number.parseInt(v.get('year')!))), { initialValue: Number.parseInt(this.activeRouter.snapshot.paramMap.get('year')!) })
  provincia = toSignal(this.activeRouter.paramMap.pipe(map((v) =>v.get('provincia')!)), { initialValue: this.activeRouter.snapshot.paramMap.get('provincia')! })
  festivos$ = merge(
    toObservable(this.year),
    toObservable(this.provincia)
  ).pipe(switchMap(() => this.trpcService.findFestivosProvincia(this.provincia(), this.year())))
  festivos = toSignal(
    this.festivos$
  );

  readonly meses = meses;

  getFestivos(idx: number) {
    return this.festivos()?.[meses[idx]] || [];
  }
}
