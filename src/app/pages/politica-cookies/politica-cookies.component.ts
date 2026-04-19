import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavbarService } from '@/app/services/top-navbar.service';
import { MetadataService } from '@/app/services/metadata.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-politica-cookies',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <header class="mb-10 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Política de Cookies</h1>
        <p class="text-sm text-gray-500 font-medium italic">Última actualización: 19 de abril de 2026</p>
      </header>

      <div class="prose prose-lg max-w-none space-y-8 text-gray-700 leading-relaxed">
        <section class="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <p class="text-blue-800 m-0">
            Esta política detalla qué cookies utilizamos y cómo afectan a tu privacidad. Para información general sobre el tratamiento de tus datos, 
            consulta nuestra <a routerLink="/politica-privacidad" class="font-bold underline hover:text-blue-900">Política de Privacidad</a>.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">1. ¿Qué son las cookies?</h2>
          <p>
            Una cookie es un pequeño archivo de texto que se almacena en su navegador cuando visita casi cualquier página web. 
            Su utilidad es que la web sea capaz de recordar su visita cuando vuelva a navegar por esa página, permitiendo 
            personalizar contenidos y mejorar la eficiencia del sitio.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">2. Cookies utilizadas en este sitio web</h2>
          <p>Siguiendo las directrices de la Agencia Española de Protección de Datos, procedemos a detallar el uso de cookies que hace esta web:</p>
          
          <div class="mt-6 overflow-x-auto shadow-sm rounded-lg">
            <table class="min-w-full border-collapse border border-gray-200 text-sm bg-white">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border border-gray-200 px-4 py-3 text-left">Categoría</th>
                  <th class="border border-gray-200 px-4 py-3 text-left">Propósito</th>
                  <th class="border border-gray-200 px-4 py-3 text-left">Proveedor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-200 px-4 py-3 font-semibold">Técnicas</td>
                  <td class="border border-gray-200 px-4 py-3">Permiten navegar por el sitio y usar funciones esenciales.</td>
                  <td class="border border-gray-200 px-4 py-3">Propia</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 px-4 py-3 font-semibold">Análisis</td>
                  <td class="border border-gray-200 px-4 py-3">Obtenemos estadísticas de uso anónimas para mejorar la aplicación.</td>
                  <td class="border border-gray-200 px-4 py-3">Counterscale</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 px-4 py-3 font-semibold">Publicidad</td>
                  <td class="border border-gray-200 px-4 py-3">Google AdSense utiliza estas cookies para mostrar anuncios relevantes según tus intereses.</td>
                  <td class="border border-gray-200 px-4 py-3">Google LLC / DoubleClick</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">3. Google AdSense y Privacidad</h2>
          <p>
            Google utiliza la cookie de <strong>DoubleClick</strong> para permitir que tanto el sitio como sus socios publiquen anuncios basados 
            en las visitas de los usuarios. Esta tecnología ayuda a que el proyecto siga siendo <strong>gratuito y de acceso abierto</strong>.
          </p>
          <div class="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-400">
            <p class="m-0">
              Usted puede gestionar sus preferencias y desactivar la publicidad personalizada en cualquier momento en: 
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener" class="text-indigo-600 font-semibold underline ml-1">Google Ads Settings</a>.
            </p>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">4. Gestión de Cookies</h2>
          <p>
            Usted tiene la libertad de aceptar o rechazar cookies. La mayoría de los navegadores web aceptan cookies automáticamente, 
            pero normalmente puede modificar la configuración de su navegador para rechazarlas si lo prefiere. 
          </p>
          <p class="mt-2 text-sm text-gray-500 italic">
            Nota: Al ser un proyecto de código abierto, puede inspeccionar nuestro código en GitHub para verificar que solo se inyectan 
            los scripts de terceros declarados aquí.
          </p>
        </section>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class PoliticaCookiesComponent {
  private readonly topNavbarService = inject(TopNavbarService);
  private readonly metadataService = inject(MetadataService);

  constructor() {
    this.topNavbarService.title.set('Política de Cookies');
    this.metadataService.updateMetadata({
      title: 'Política de Cookies - CalendarioVacaciones.com',
      description: 'Información detallada sobre el uso de cookies y publicidad personalizada en este sitio web.',
      updateCanonical: true
    });
  }
}
