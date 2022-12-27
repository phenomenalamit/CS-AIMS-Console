import { TestBed } from '@angular/core/testing';

import { IndividualCrudServiceService } from './individual-crud-service.service';

describe('IndividualCrudServiceService', () => {
  let service: IndividualCrudServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndividualCrudServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
