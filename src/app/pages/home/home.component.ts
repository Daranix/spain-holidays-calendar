import { Component, computed, inject, signal } from '@angular/core';
import { MapComponent } from '../../components/map/map.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { TopNavbarService } from '@/app/services/top-navbar.service';
import { RestClientService } from '@/app/services/rest-client.service';
import { GoogleAdComponent } from '@/app/components/google-ad/google-ad.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MapComponent,
    FormsModule,
    GoogleAdComponent
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
  readonly years = toSignal(this.restClient.getYears(), { initialValue: [] });
  readonly yearsGrouped = computed(() => {
    const groups: Record<string, number[]> = {};
    for (const year of this.years()) {
      if(!groups[year.groupName]) {
        groups[year.groupName] = [];
      }
      const yearList = groups[year.groupName]!;
      yearList.push(year.year);
    }
    return Object.entries(groups);
  });
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
