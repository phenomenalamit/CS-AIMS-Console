import { TestBed } from '@angular/core/testing';

import { SustainableDevelopmentTargetService } from './sustainable-development-target.service';

describe('SustainableDevelopmentTargetService', () => {
  let service: SustainableDevelopmentTargetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SustainableDevelopmentTargetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
