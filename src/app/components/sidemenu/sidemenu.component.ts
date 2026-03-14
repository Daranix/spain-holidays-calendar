import { RestClientService } from '@/app/services/rest-client.service';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { Capacitor } from '@capacitor/core';

import { SpinnerComponent } from '@/app/spinner/spinner.component';

import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sidemenu',
    imports: [
        RouterModule,
        SpinnerComponent,
        CommonModule
    ],
    templateUrl: './sidemenu.component.html',
    styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {

  private readonly restClient = inject(RestClientService);
  readonly isNative = Capacitor.isNativePlatform();
  
  readonly provinciasResource = rxResource({
    stream: () => this.restClient.getProvincias()
  });

  readonly currentYear = new Date().getFullYear();

}
