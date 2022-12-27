import { TestBed } from '@angular/core/testing';

import { EnvelopeServiceService } from './envelope-service.service';

describe('EnvelopeServiceService', () => {
  let service: EnvelopeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvelopeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
