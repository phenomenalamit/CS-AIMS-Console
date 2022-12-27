import { TestBed } from '@angular/core/testing';

import { PrimaryLinkService } from './primary-link.service';

describe('PrimaryLinkService', () => {
  let service: PrimaryLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrimaryLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
