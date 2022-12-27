import { TestBed } from '@angular/core/testing';

import { FinancingServiceService } from './financing-service.service';

describe('FinancingServiceService', () => {
  let service: FinancingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
