import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavbarService } from '@/app/services/top-navbar.service';
import { MetadataService } from '@/app/services/metadata.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terminos-condiciones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <header class="mb-10 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Términos y Condiciones de Uso</h1>
        <p class="text-sm text-gray-500 font-medium italic">Última actualización: 19 de abril de 2026</p>
      </header>

      <div class="prose prose-lg max-w-none space-y-8 text-gray-700 leading-relaxed">
        <section class="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
          <h2 class="text-xl font-bold text-indigo-900 mb-2">Aviso de Código Abierto (Open Source)</h2>
          <p class="text-gray-700 m-0">
            Este es un proyecto impulsado por la comunidad y de código abierto. Puede encontrar el código fuente completo, 
            contribuir o reportar errores en nuestro repositorio oficial de 
            <a href="https://github.com/Daranix/spain-holidays-calendar" target="_blank" rel="noopener noreferrer" class="font-bold underline text-indigo-700">GitHub</a>.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">1. Aceptación de los términos</h2>
          <p>
            Al utilizar <strong>CalendarioVacaciones.com</strong>, acepta estar sujeto a estos términos, que buscan proteger 
            la integridad de la comunidad y del proyecto. Este sitio es un recurso gratuito destinado a facilitar la consulta de festivos en España.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">2. Licencia y Uso del Software</h2>
          <p>
            Como proyecto de código abierto, el software se distribuye bajo licencias abiertas (consultar el archivo LICENSE en el repositorio). 
            Se concede permiso para utilizar el sitio de forma personal para:
          </p>
          <ul class="list-disc list-inside mt-4 space-y-2 ml-4">
            <li>Consultar y planificar festivos laborales.</li>
            <li>Colaborar en la mejora de la base de datos de festivos a través de canales oficiales.</li>
            <li>Bifurcar (fork) o mejorar el código para proyectos comunitarios derivados, respetando la autoría original.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">3. Exención de responsabilidad (Disclaimer)</h2>
          <p class="bg-amber-50 p-4 border-l-4 border-amber-400 text-amber-900 font-medium">
            IMPORTANTE: La información aquí contenida proviene de fuentes oficiales (BOE, Boletines Autonómicos). No obstante, 
            al ser un proyecto mantenido por la comunidad, no garantizamos la ausencia total de errores. Siempre debe verificar 
            los festivos con el calendario oficial de su ayuntamiento o comunidad autónoma antes de tomar decisiones laborales.
          </p>
          <p class="mt-4">
            El servicio se proporciona "tal cual" y "según disponibilidad", sin garantías de ningún tipo, expresas o implícitas.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">4. Privacidad y Cookies</h2>
          <p>
            Su privacidad es primordial. Para entender cómo gestionamos sus datos mínimos de navegación y las cookies publicitarias 
            que mantienen este servidor activo, revise nuestra:
          </p>
          <div class="flex flex-col sm:flex-row gap-4 mt-4">
            <a routerLink="/politica-privacidad" class="text-indigo-600 font-bold underline">Política de Privacidad</a>
            <a routerLink="/politica-cookies" class="text-indigo-600 font-bold underline">Política de Cookies</a>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">5. Colaboración Comunitaria</h2>
          <p>
            Si detecta algún error en los datos de festivos o en el funcionamiento del sitio, le animamos a abrir un "Issue" en GitHub 
            o contactarnos directamente. La exactitud de este calendario depende en gran medida de la colaboración de todos.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">6. Jurisdicción</h2>
          <p>
            Estos términos se rigen por las leyes de España. Cualquier disputa se someterá a la jurisdicción exclusiva de los tribunales correspondientes.
          </p>
        </section>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class TerminosCondicionesComponent {
  private readonly topNavbarService = inject(TopNavbarService);
  private readonly metadataService = inject(MetadataService);

  constructor() {
    this.topNavbarService.title.set('Términos y Condiciones');
    this.metadataService.updateMetadata({
      title: 'Términos y Condiciones - CalendarioVacaciones.com',
      description: 'Condiciones de uso, exención de responsabilidad y carácter abierto del proyecto CalendarioVacaciones.com.',
      updateCanonical: true
    });
  }
}
