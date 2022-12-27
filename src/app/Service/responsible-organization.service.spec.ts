import { TestBed } from '@angular/core/testing';

import { ResponsibleOrganizationService } from './responsible-organization.service';

describe('ResponsibleOrganizationService', () => {
  let service: ResponsibleOrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsibleOrganizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
