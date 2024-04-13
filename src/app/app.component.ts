import { Component, inject, model, signal } from '@angular/core';
import { EventType, Router, RouterOutlet } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { TopNavbarService } from './services/top-navbar/top-navbar.service';
import { MenuIconComponent } from './menu-icon/menu-icon.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SidemenuComponent,
    RouterOutlet,
    MenuIconComponent,
    CommonModule
  ],
  providers: [
    TopNavbarService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  readonly topNavbarService = inject(TopNavbarService);
  readonly isNative = Capacitor.isNativePlatform();
  readonly showMenu = model(false);

  private readonly router = inject(Router);

  constructor() {
    this.router.events.pipe(filter((e) => e.type === EventType.NavigationEnd)).subscribe((e) => this.showMenu.set(false));
  }
}
