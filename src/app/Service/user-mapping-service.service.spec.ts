import { TestBed } from '@angular/core/testing';

import { UserMappingServiceService } from './user-mapping-service.service';

describe('UserMappingServiceService', () => {
  let service: UserMappingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMappingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
