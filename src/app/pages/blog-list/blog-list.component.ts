import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RestClientService } from '@/app/services/rest-client.service';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent {
  private readonly restClient = inject(RestClientService);

  readonly postsResource = rxResource({
    stream: () => this.restClient.getBlogPosts()
  });

  readonly posts = computed(() => this.postsResource.value() ?? []);
  readonly isLoading = computed(() => this.postsResource.isLoading());
  readonly error = computed(() => this.postsResource.error() != null);
}
