import { TestBed } from '@angular/core/testing';

import { LabelMasterService } from './label-master.service';

describe('LabelMasterService', () => {
  let service: LabelMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabelMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
