import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RestClientService } from '@/app/services/rest-client.service';
import { MetadataService } from '@/app/services/metadata.service';
import { TopNavbarService } from '@/app/services/top-navbar.service';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent {
  private readonly restClient = inject(RestClientService);
  private readonly metadataService = inject(MetadataService);
  private readonly topNavbarService = inject(TopNavbarService);

  readonly postsResource = rxResource({
    stream: () => this.restClient.getBlogPosts()
  });

  readonly posts = computed(() => this.postsResource.value() ?? []);
  readonly isLoading = computed(() => this.postsResource.isLoading());
  readonly error = computed(() => this.postsResource.error() != null);

  constructor() {
    this.topNavbarService.title.set('Blog');
    this.metadataService.updateMetadata({
      title: 'Blog - Calendario Festivos España',
      description: 'Artículos y guías sobre festivos laborales en España. Consejos para planificar tus vacaciones, puentes y días libres aprovechando el calendario laboral.',
      updateCanonical: true
    });
  }
}
