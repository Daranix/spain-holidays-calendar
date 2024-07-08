import { RestClientService } from '@/app/services/rest-client.service';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {

  private readonly restClient = inject(RestClientService);
  readonly isNative = Capacitor.isNativePlatform();
  readonly provincias = toSignal(this.restClient.getProvincias());
  readonly currentYear = new Date().getFullYear();

}
