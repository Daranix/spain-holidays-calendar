import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly hasConsent = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const consent = localStorage.getItem('cookie-consent');
      if (consent === 'true') {
        this.hasConsent.set(true);
      }
    }
  }

  setConsent(value: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cookie-consent', value.toString());
      this.hasConsent.set(value);
    }
  }
}
