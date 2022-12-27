import { TestBed } from '@angular/core/testing';

import { OrganizationCrudServiceService } from './organization-crud-service.service';

describe('OrganizationCrudServiceService', () => {
  let service: OrganizationCrudServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationCrudServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
