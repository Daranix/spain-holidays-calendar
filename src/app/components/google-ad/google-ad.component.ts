import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, PLATFORM_ID, inject } from '@angular/core';

@Component({
  selector: 'app-google-ad',
  standalone: true,
  imports: [],
  templateUrl: './google-ad.component.html',
  styleUrl: './google-ad.component.scss'
})
export class GoogleAdComponent implements AfterViewInit {

  private readonly platform = inject(PLATFORM_ID);



  ngAfterViewInit(): void {
    this.loadAd();
  }

  private loadAd() {
    if(isPlatformBrowser(this.platform)) {
        try {
            // @ts-ignore
            (window["adsbygoogle"] = window["adsbygoogle"] || []).push({});
        } catch (e) {
            console.error("Error loading the ads", e);
        }
    }
}

}
