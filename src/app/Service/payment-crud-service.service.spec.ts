import { TestBed } from '@angular/core/testing';

import { PaymentCrudServiceService } from './payment-crud-service.service';

describe('PaymentCrudServiceService', () => {
  let service: PaymentCrudServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentCrudServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
