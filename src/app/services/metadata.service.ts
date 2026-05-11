
import { inject, Injectable, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '@/app/environments/environment';


interface MetaInfo {
  title: string;
  description: string;
  updateCanonical?: boolean;
  keywords?: string;
  thumbnail?: string;
  noindex?: boolean;
  pathOverride?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);


  updateMetadata({ title, description, updateCanonical = true, keywords, thumbnail, noindex = false, pathOverride }: MetaInfo) {

    this.title.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:title', content: title });

    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'description', content: description });

    this.meta.updateTag({ property: 'og:type', content: 'website' });

    if (keywords) {
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }

    if (thumbnail) {
      this.meta.updateTag({ property: 'og:image', content: thumbnail })
      this.meta.updateTag({ name: 'twitter:image', content: thumbnail })
    }

    if (updateCanonical) {
      this.updateCanonicalUrl(pathOverride);
    }

    if (noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    }
  }


  private updateCanonicalUrl(pathOverride?: string) {
    const path = pathOverride ?? this.router.url;
    const canonicalUrl = `${environment.baseUrl}${path}`;

    let link = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);

    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
  }

}
