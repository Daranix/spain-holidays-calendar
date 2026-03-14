import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, PLATFORM_ID, inject, effect } from '@angular/core';
import { ConsentService } from '@/app/services/consent.service';

@Component({
    selector: 'app-google-ad',
    imports: [],
    templateUrl: './google-ad.component.html',
    styleUrl: './google-ad.component.scss'
})
export class GoogleAdComponent implements AfterViewInit {

  private readonly platform = inject(PLATFORM_ID);
  private readonly consentService = inject(ConsentService);
  private adLoaded = false;

  constructor() {
    effect(() => {
        if(this.consentService.hasConsent()) {
            this.loadAd();
        }
    });
  }

  ngAfterViewInit(): void {
    this.loadAd();
  }

  private loadAd() {
    if(isPlatformBrowser(this.platform) && this.consentService.hasConsent() && !this.adLoaded) {
        try {
            // @ts-ignore
            (window["adsbygoogle"] = window["adsbygoogle"] || []).push({});
            this.adLoaded = true;
        } catch (e) {
            console.error("Error loading the ads", e);
        }
    }
}

}
