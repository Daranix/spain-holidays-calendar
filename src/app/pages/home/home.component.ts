import { Component, afterNextRender, inject, signal } from '@angular/core';
import { MapComponent } from '../../components/map/map.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { TopNavbarService } from '@/app/services/top-navbar/top-navbar.service';
import { RestClientService } from '@/app/services/rest-client/rest-client.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MapComponent,
    FormsModule
  ],
  providers: [
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  readonly isNative = Capacitor.isNativePlatform();
  readonly currentYear = new Date().getFullYear();
  private readonly restClient = inject(RestClientService);
  private readonly router = inject(Router);
  readonly provincias$ = this.restClient.getProvincias();
  readonly provincias = toSignal(this.provincias$);
  readonly years = toSignal(this.restClient.getYears());
  readonly selectedValues = signal({
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
