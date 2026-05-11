import { Component, inject } from '@angular/core';
import { MetadataService } from '@/app/services/metadata.service';
import { TopNavbarService } from '@/app/services/top-navbar.service';

@Component({
  selector: 'app-developers',
  templateUrl: './developers.component.html',
  styleUrl: './developers.component.scss'
})
export class DevelopersComponent {
  private readonly metadataService = inject(MetadataService);
  private readonly topNavbarService = inject(TopNavbarService);

  constructor() {
    this.topNavbarService.title.set('Desarrolladores');
    this.metadataService.updateMetadata({
      title: 'API de Festivos España - Desarrolladores',
      description: 'Documentación para desarrolladores de la API de CalendarioVacaciones.com. Integra los festivos laborales de España en tu aplicación con nuestra API REST gratuita.',
      keywords: 'API festivos, API calendario laboral, desarrolladores, REST API, España',
      updateCanonical: true
    });
  }
}
