import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TopNavbarService } from '@/app/services/top-navbar.service';
import { MetadataService } from '@/app/services/metadata.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-politica-privacidad',
    imports: [RouterLink],
    templateUrl: './politica-privacidad.component.html',
    styleUrl: './politica-privacidad.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoliticaPrivacidadComponent {

  private readonly topNavbarService = inject(TopNavbarService);
  private readonly metadataService = inject(MetadataService);

  constructor() {
    this.topNavbarService.title.set('Política de Privacidad');
    this.metadataService.updateMetadata({
      title: 'Política de Privacidad - Calendario Festivos España',
      description: 'Política de privacidad de CalendarioVacaciones.com. Información sobre el tratamiento de datos personales, cookies y publicidad.',
      keywords: 'política de privacidad, cookies, protección de datos, RGPD',
      updateCanonical: true
    });
  }
}
