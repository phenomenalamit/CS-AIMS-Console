import { TestBed } from '@angular/core/testing';

import { UserTypeServiceService } from './user-type-service.service';

describe('UserTypeServiceService', () => {
  let service: UserTypeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTypeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
