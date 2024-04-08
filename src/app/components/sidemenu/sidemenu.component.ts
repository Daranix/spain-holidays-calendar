import { TRPCClientService } from '@/app/services/trpc-client.service';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

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

  trpcClient = inject(TRPCClientService);
  provincias = toSignal(this.trpcClient.getProvincias());
  currentYear = new Date().getFullYear();

}
