import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { RestClientService } from '@/app/services/rest-client.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, from } from 'rxjs';
import { marked } from 'marked';
import fm from 'front-matter';

import { CommonModule } from '@angular/common';
import { ErrorComponent } from '../error/error.component';

interface PostMetadata {
  title: string;
  slug: string;
  date: string;
  lastMod?: string;
  excerpt?: string;
  [key: string]: unknown;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, ErrorComponent, RouterLink],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private restClient = inject(RestClientService);

  readonly slug = toSignal(this.route.paramMap.pipe(map(params => params.get('slug')!)));

  readonly postResource = rxResource({
    params: () => this.slug(),
    stream: (params) => this.loadPost(params)
  });

  private loadPost({ params: slug }: { params: string | null | undefined }) {
    if (!slug) throw new Error('No slug provided');

    return this.restClient.getBlogPost(slug!).pipe(
      switchMap(rawMarkdown => from(this.parsePostContent(rawMarkdown)))
    );
  }

  private async parsePostContent(rawMarkdown: string) {
    const parsed = fm<PostMetadata>(rawMarkdown);
    const html = await marked.parse(parsed.body);
    return {
      metadata: parsed.attributes,
      content: this.sanitizer.bypassSecurityTrustHtml(html)
    };
  }

  readonly metadata = computed(() => {
    if (this.error()) return null;
    return this.postResource.value()?.metadata ?? null;
  });

  readonly content = computed(() => {
    if (this.error()) return null;
    return this.postResource.value()?.content ?? null;
  });

  readonly error = computed(() => this.postResource.error() !== undefined);
  
  readonly errorCode = computed(() => {
    const err = this.postResource.error();
    if (err instanceof HttpErrorResponse) {
      return err.status;
    }
    return 500;
  });

  readonly isLoading = computed(() => this.postResource.isLoading());
}
