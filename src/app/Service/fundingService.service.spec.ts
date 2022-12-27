import { TestBed } from '@angular/core/testing';

import { FundingServiceService } from './fundingService.service';

describe('FundingServiceService', () => {
  let service: FundingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
