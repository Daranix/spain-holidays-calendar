
import { inject, Injectable, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';


interface MetaInfo {
  title: string;
  description: string;
  updateCanonical?: boolean;
  keywords?: string;
  thumbnail?: string;
  noindex?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);


  updateMetadata({ title, description, updateCanonical = true, keywords, thumbnail, noindex = false }: MetaInfo) {

    this.title.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });

    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'description', content: description });

    if (keywords) {
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }

    if (thumbnail) {
      this.meta.updateTag({ property: 'og:image', content: thumbnail })
      this.meta.updateTag({ name: 'twitter:image', content: thumbnail })
    }

    if (updateCanonical) {
      this.updateCanonnicalUrl();
    }

    if (noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    }
  }


  private updateCanonnicalUrl(url?: string) {
    const canURL = !url ? this.document.URL : url;
    let link = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', canURL);
  }

}
