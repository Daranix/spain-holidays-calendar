import { TestBed } from '@angular/core/testing';

import { TopNavbarService } from './top-navbar.service';

describe('TopNavbarService', () => {
  let service: TopNavbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopNavbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
