import { TestBed } from '@angular/core/testing';

import { PurposeDACCRSService } from './purpose-dac-crs.service';

describe('PurposeDACCRSService', () => {
  let service: PurposeDACCRSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurposeDACCRSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
