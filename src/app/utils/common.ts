import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID, inject } from "@angular/core";

export function updateCanonnicalUrl(url?: string) {
    const document = inject(DOCUMENT);
    const canURL = !url ? document.URL : url;
    const canonicalElement = document.head.querySelector('link[rel="canonical"]');
    if(canonicalElement) {
        canonicalElement.setAttribute('href', canURL);
    } else {
        const link: HTMLLinkElement = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
        link.setAttribute('href', canURL);
    }
}