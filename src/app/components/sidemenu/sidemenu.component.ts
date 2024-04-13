import { TRPCClientService } from '@/app/services/trpc-client/trpc-client.service';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [
    RouterModule
  ],
  providers: [
    TRPCClientService
  ],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {

  private readonly trpcClient = inject(TRPCClientService);
  readonly isNative = Capacitor.isNativePlatform();
  readonly provincias = toSignal(this.trpcClient.getProvincias());
  readonly currentYear = new Date().getFullYear();

}
