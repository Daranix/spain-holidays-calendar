import { Component, afterNextRender, inject, signal } from '@angular/core';
import { MapComponent } from '../../components/map/map.component';
import { TRPCClientService } from '@/app/services/trpc-client.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MapComponent,
    FormsModule
  ],
  providers: [
    TRPCClientService
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  currentYear = new Date().getFullYear();
  trpcClient = inject(TRPCClientService);
  router = inject(Router);
  provincias$ = this.trpcClient.getProvincias();
  provincias = toSignal(this.provincias$);
  years = toSignal(this.trpcClient.getYears());
  selectedValues = signal({
    year: this.currentYear,
    provincia: ''
  });

  async showFestivos(form: NgForm) {
    const { year, provincia } = form.value;
    await this.router.navigate(['festivos', provincia, year])
  }
}
