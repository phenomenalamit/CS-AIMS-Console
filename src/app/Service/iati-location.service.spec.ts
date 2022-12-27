import { TestBed } from '@angular/core/testing';

import { IatiLocationService } from './iati-location.service';

describe('IatiLocationService', () => {
  let service: IatiLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IatiLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
