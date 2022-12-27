import { TestBed } from '@angular/core/testing';

import { FinancingAgreementService } from './financing-agreement.service';

describe('FinancingAgreementService', () => {
  let service: FinancingAgreementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancingAgreementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
