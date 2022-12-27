import { TestBed } from '@angular/core/testing';

import { FieldManagementServiceService } from './field-management-service.service';

describe('FieldManagementServiceService', () => {
  let service: FieldManagementServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldManagementServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
