import { TestBed } from '@angular/core/testing';

import { ExchangeRateServiceService } from './exchange-rate-service.service';

describe('ExchangeRateServiceService', () => {
  let service: ExchangeRateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExchangeRateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
