import { Component, inject } from '@angular/core';
import { ConsentService } from '@/app/services/consent.service';

@Component({
  selector: 'app-cookie-banner',
  imports: [],
  templateUrl: './cookie-banner.component.html',
})
export class CookieBannerComponent {
  private readonly consentService = inject(ConsentService);
  readonly showBanner = () => !this.consentService.hasConsent();

  acceptCookies(): void {
    this.consentService.setConsent(true);
  }
}
