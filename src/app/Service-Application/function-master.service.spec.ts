import { TestBed } from '@angular/core/testing';

import { FunctionMasterService } from './function-master.service';

describe('FunctionMasterService', () => {
  let service: FunctionMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FunctionMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
