import { TestBed } from '@angular/core/testing';

import { ReportAdministrationServiceService } from './report-administration-service.service';

describe('ReportAdministrationServiceService', () => {
  let service: ReportAdministrationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportAdministrationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
