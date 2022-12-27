import { TestBed } from '@angular/core/testing';

import { FundingOrganizationService } from './funding-organization.service';

describe('FundingOrganizationService', () => {
  let service: FundingOrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundingOrganizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
