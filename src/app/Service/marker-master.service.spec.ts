import { TestBed } from '@angular/core/testing';

import { MarkerMasterService } from './marker-master.service';

describe('MarkerMasterService', () => {
  let service: MarkerMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkerMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
