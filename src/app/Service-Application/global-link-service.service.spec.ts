import { TestBed } from '@angular/core/testing';

import { GlobalLinkServiceService } from './global-link-service.service';

describe('GlobalLinkServiceService', () => {
  let service: GlobalLinkServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalLinkServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
