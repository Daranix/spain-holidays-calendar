import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TopNavbarService } from '@/app/services/top-navbar.service';
import { MetadataService } from '@/app/services/metadata.service';

@Component({
    selector: 'app-contacto',
    imports: [],
    templateUrl: './contacto.component.html',
    styleUrl: './contacto.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactoComponent {

  private readonly topNavbarService = inject(TopNavbarService);
  private readonly metadataService = inject(MetadataService);

  constructor() {
    this.topNavbarService.title.set('Contacto');
    this.metadataService.updateMetadata({
      title: 'Contacto - Calendario Festivos España',
      description: 'Contacta con CalendarioVacaciones.com para reportar errores, sugerencias o cualquier consulta sobre los festivos laborales en España.',
      keywords: 'contacto, calendario festivos, sugerencias, reportar error',
      updateCanonical: true
    });
  }
}
