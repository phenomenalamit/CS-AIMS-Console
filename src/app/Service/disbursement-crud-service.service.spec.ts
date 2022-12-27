import { TestBed } from '@angular/core/testing';

import { DisbursementCrudServiceService } from './disbursement-crud-service.service';

describe('DisbursementCrudServiceService', () => {
  let service: DisbursementCrudServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisbursementCrudServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
