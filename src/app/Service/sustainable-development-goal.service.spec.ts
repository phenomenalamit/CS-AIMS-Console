import { TestBed } from '@angular/core/testing';

import { SustainableDevelopmentGoalService } from './sustainable-development-goal.service';

describe('SustainableDevelopmentGoalService', () => {
  let service: SustainableDevelopmentGoalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SustainableDevelopmentGoalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
