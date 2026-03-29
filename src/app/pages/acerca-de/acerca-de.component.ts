import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TopNavbarService } from '@/app/services/top-navbar.service';
import { MetadataService } from '@/app/services/metadata.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-acerca-de',
    imports: [RouterLink],
    templateUrl: './acerca-de.component.html',
    styleUrl: './acerca-de.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcercaDeComponent {

  private readonly topNavbarService = inject(TopNavbarService);
  private readonly metadataService = inject(MetadataService);

  constructor() {
    this.topNavbarService.title.set('Acerca de');
    this.metadataService.updateMetadata({
      title: 'Acerca de - Calendario Festivos España',
      description: 'Conoce CalendarioVacaciones.com, tu recurso de referencia para consultar los festivos laborales de todas las provincias de España.',
      keywords: 'acerca de, calendario festivos, españa, quiénes somos',
      updateCanonical: true
    });
  }
}
