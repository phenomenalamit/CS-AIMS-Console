import { TestBed } from '@angular/core/testing';

import { UserAccessClassService } from './user-access-class.service';

describe('UserAccessClassService', () => {
  let service: UserAccessClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAccessClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
