import { TestBed } from '@angular/core/testing';

import { CountryDialingCodeService } from './country-dialing-code.service';

describe('CountryDialingCodeService', () => {
  let service: CountryDialingCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryDialingCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
