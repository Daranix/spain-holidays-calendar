import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { TopNavbarService } from '@/app/services/top-navbar.service';
import { RestClientService } from '@/app/services/rest-client.service';
import { GoogleAdComponent } from '@/app/components/google-ad/google-ad.component';
import { MetadataService } from '@/app/services/metadata.service';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    GoogleAdComponent,
    CommonModule,
    RouterLink
  ],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  readonly isNative = Capacitor.isNativePlatform();
  readonly currentYear = new Date().getFullYear();
  private readonly restClient = inject(RestClientService);

  readonly provinciasResource = rxResource({
    stream: () => this.restClient.getProvincias()
  });
  private readonly router = inject(Router);
  private readonly metadataService = inject(MetadataService);

  readonly yearsResource = rxResource({
    stream: () => this.restClient.getYears()
  });

  readonly yearsGrouped = computed(() => {
    const groups: Record<string, any[]> = {};
    const years = this.yearsResource.value() || [];
    for (const year of years) {
      if (!groups[year.groupName]) {
        groups[year.groupName] = [];
      }
      groups[year.groupName].push(year.year);
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
    this.metadataService.updateMetadata({
      title: 'Calendario Festivos España 2025 - 2026',
      description: 'Consulta los festivos de tu provincia para los años 2025 y 2026. Calendario laboral completo de España.',
      keywords: 'calendario, festivos, españa, 2025, 2026, vacaciones, laboral',
      updateCanonical: true
    });
  }

}
