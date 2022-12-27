import { TestBed } from '@angular/core/testing';

import { ImplementingOrganizationService } from './implementing-organization.service';

describe('ImplementingOrganizationService', () => {
  let service: ImplementingOrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImplementingOrganizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
