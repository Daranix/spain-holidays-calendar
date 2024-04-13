import { Component, afterNextRender, inject, signal } from '@angular/core';
import { MapComponent } from '../../components/map/map.component';
import { TRPCClientService } from '@/app/services/trpc-client/trpc-client.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { TopNavbarService } from '@/app/services/top-navbar/top-navbar.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MapComponent,
    FormsModule
  ],
  providers: [
    TRPCClientService
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  readonly isNative = Capacitor.isNativePlatform();
  currentYear = new Date().getFullYear();
  trpcClient = inject(TRPCClientService);
  router = inject(Router);
  provincias$ = this.trpcClient.getProvincias();
  provincias = toSignal(this.provincias$);
  years = toSignal(this.trpcClient.getYears());
  selectedValues = signal({
    year: this.currentYear,
    provincia: ''
  });

  readonly topNavbarService = inject(TopNavbarService);

  async showFestivos(form: NgForm) {
    const { year, provincia } = form.value;
    await this.router.navigate(['festivos', provincia, year])
  }

  constructor() {
    this.topNavbarService.title.set('Inicio');
  }
}
