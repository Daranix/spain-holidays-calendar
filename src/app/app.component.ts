import { ChangeDetectorRef, Component, PLATFORM_ID, inject, model } from '@angular/core';
import { EventType, Router, RouterOutlet } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { CookieBannerComponent } from './components/cookie-banner/cookie-banner.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopNavbarService } from './services/top-navbar.service';
import { MenuIconComponent } from './menu-icon/menu-icon.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  imports: [
    SidemenuComponent,
    RouterOutlet,
    MenuIconComponent,
    CommonModule,
    CookieBannerComponent,
    FooterComponent
  ],
  providers: [
    TopNavbarService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  private readonly changeDefectorRef = inject(ChangeDetectorRef);
  readonly topNavbarService = inject(TopNavbarService);
  readonly isNative = Capacitor.isNativePlatform();
  readonly showMenu = model(false);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  constructor() {
    this.router.events.pipe(filter((e) => e.type === EventType.NavigationEnd)).subscribe(() => this.showMenu.set(false));

    if (isPlatformBrowser(this.platformId)) {
      App.addListener('backButton', (evt) => {
        if (this.showMenu()) {
          this.showMenu.set(false);
          this.changeDefectorRef.detectChanges();
          return;
        }

        if (!evt.canGoBack) {
          App.exitApp();
        } else {
          history.back();
        }
      });
    }
  }
}
